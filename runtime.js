const http = require("node:http");
const { Events } = require("discord.js");

async function startBot({ client, commands, config, logger = console }) {
  let ready = false;
  let server;
  let stopping;

  function stop() {
    if (!stopping) {
      ready = false;
      process.removeListener("SIGINT", onSignal);
      process.removeListener("SIGTERM", onSignal);
      stopping = (async () => {
        await client.destroy();
        if (server?.listening) {
          await new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
            server.closeIdleConnections();
          });
        }
      })();
    }
    return stopping;
  }

  function onSignal() {
    stop().catch(() => {
      logger.error("Failed to shut down cleanly.");
      process.exitCode = 1;
    });
  }

  process.once("SIGINT", onSignal);
  process.once("SIGTERM", onSignal);
  client.on(Events.Error, (error) => logger.error("Discord client error:", error.message));

  // Attach before login: ClientReady may fire before login() resolves.
  const initialized = new Promise((resolve, reject) => {
    client.once(Events.ClientReady, () => {
      Promise.resolve().then(async () => {
        await client.application.commands.set(commands);
        ready = true;
        logger.log("Ready!");
      }).then(resolve, reject);
    });
  });
  // Observe rejection even if HTTP startup fails before login is attempted.
  initialized.catch(() => {});

  try {
    if (config.port !== undefined) {
      server = http.createServer((req, res) => {
        if (req.url !== "/" && req.url !== "/health") {
          res.writeHead(404).end();
          return;
        }
        const connected = ready && client.isReady();
        res.writeHead(connected ? 200 : 503, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: connected ? "ready" : "starting" }));
      });
      await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(config.port, config.host, () => {
          server.removeListener("error", reject);
          resolve();
        });
      });
      logger.log(`Health endpoint listening on ${config.host}:${config.port}`);
    }
    await Promise.all([client.login(config.token), initialized]);
    return { stop, server };
  } catch (error) {
    await stop();
    throw error;
  }
}

module.exports = { startBot };
