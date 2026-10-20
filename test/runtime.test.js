const test = require("node:test");
const assert = require("node:assert/strict");
const { EventEmitter, once } = require("node:events");
const http = require("node:http");
const { Events } = require("discord.js");
const { startBot } = require("../runtime.js");

const logger = { log() {}, error() {} };
class FakeClient extends EventEmitter {
  constructor({ loginError, registrationError } = {}) {
    super();
    this.connected = false;
    this.loginError = loginError;
    this.application = { commands: { set: async (commands) => {
      if (registrationError) throw registrationError;
      this.commands = commands;
    } } };
  }
  async login(token) {
    this.token = token;
    if (this.loginError) throw this.loginError;
    this.connected = true;
    this.emit(Events.ClientReady);
  }
  isReady() { return this.connected; }
  async destroy() { this.destroyed = true; this.connected = false; }
}
function request(server, route = "/health") {
  return new Promise((resolve, reject) => {
    http.get({ host: "127.0.0.1", port: server.address().port, path: route }, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => resolve({ status: res.statusCode, body }));
    }).on("error", reject);
  });
}

test("starts without HTTP, registers commands, and cleans up signal handlers", async () => {
  const client = new FakeClient();
  const before = process.listenerCount("SIGTERM");
  const runtime = await startBot({ client, commands: [{ name: "ping" }], config: { token: "test" }, logger });
  assert.equal(runtime.server, undefined);
  assert.equal(client.token, "test");
  assert.equal(client.commands[0].name, "ping");
  await runtime.stop();
  await runtime.stop();
  assert.equal(client.destroyed, true);
  assert.equal(process.listenerCount("SIGTERM"), before);
});

test("optional health endpoint tracks Discord readiness and closes on shutdown", async (t) => {
  const client = new FakeClient();
  const runtime = await startBot({ client, commands: [], config: { token: "test", port: 0, host: "127.0.0.1" }, logger });
  t.after(() => runtime.stop());
  assert.equal((await request(runtime.server)).status, 200);
  assert.equal((await request(runtime.server, "/")).status, 200);
  assert.equal((await request(runtime.server, "/missing")).status, 404);
  client.connected = false;
  assert.equal((await request(runtime.server)).status, 503);
  await runtime.stop();
  assert.equal(runtime.server.listening, false);
});

test("login and command registration failures destroy the client and close HTTP", async () => {
  for (const errors of [{ loginError: new Error("login failed") }, { registrationError: new Error("registration failed") }]) {
    const client = new FakeClient(errors);
    const before = process.listenerCount("SIGTERM");
    await assert.rejects(startBot({ client, commands: [], config: { token: "test", port: 0, host: "127.0.0.1" }, logger }), /failed/);
    assert.equal(client.destroyed, true);
    assert.equal(process.listenerCount("SIGTERM"), before);
  }
});

test("port conflicts fail before logging into Discord", async (t) => {
  const occupied = http.createServer();
  occupied.listen(0, "127.0.0.1");
  await once(occupied, "listening");
  t.after(() => new Promise((resolve) => occupied.close(resolve)));
  const client = new FakeClient();
  await assert.rejects(startBot({ client, commands: [], config: { token: "test", port: occupied.address().port, host: "127.0.0.1" }, logger }), { code: "EADDRINUSE" });
  assert.equal(client.token, undefined);
  assert.equal(client.destroyed, true);
});
