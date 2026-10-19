const { loadEnvFile } = require("node:process");
const path = require("node:path");

function readConfig(env = process.env) {
  const token = env.DISCORD_TOKEN?.trim() || env.token?.trim();
  if (!token) {
    throw new Error("Set DISCORD_TOKEN in the environment or the project's .env file.");
  }

  let port;
  if (env.PORT !== undefined && env.PORT !== "") {
    if (!/^\d+$/.test(env.PORT) || Number(env.PORT) < 1 || Number(env.PORT) > 65535) {
      throw new Error("PORT must be an integer between 1 and 65535, or unset to disable HTTP.");
    }
    port = Number(env.PORT);
  }

  return { token, port, host: env.HOST?.trim() || "0.0.0.0" };
}

function loadConfig() {
  // Resolve relative to the project, even when node is launched from another directory.
  try {
    loadEnvFile(path.join(__dirname, ".env"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return readConfig();
}

module.exports = { readConfig, loadConfig };
