const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { readConfig } = require("../config.js");

function childEnv(extra = {}) {
  const env = { ...process.env };
  for (const key of ["DISCORD_TOKEN", "token", "PORT", "HOST"]) delete env[key];
  return { ...env, ...extra };
}

test("token is required; canonical and legacy token settings work", () => {
  assert.throws(() => readConfig({}), /DISCORD_TOKEN/);
  assert.throws(() => readConfig({ DISCORD_TOKEN: "  " }), /DISCORD_TOKEN/);
  assert.equal(readConfig({ token: " old " }).token, "old");
  assert.equal(readConfig({ DISCORD_TOKEN: " new ", token: "old" }).token, "new");
  assert.equal(readConfig({ DISCORD_TOKEN: "", token: "old" }).token, "old");
});

test("HTTP is optional and ports are validated", () => {
  const base = { DISCORD_TOKEN: "test-token" };
  assert.equal(readConfig(base).port, undefined);
  assert.equal(readConfig({ ...base, PORT: "" }).port, undefined);
  assert.equal(readConfig({ ...base, PORT: "3000" }).port, 3000);
  assert.equal(readConfig({ ...base, PORT: "65535", HOST: "127.0.0.1" }).host, "127.0.0.1");
  for (const PORT of ["0", "-1", "65536", "abc", "3.5", "3000foo", " 3000 "]) {
    assert.throws(() => readConfig({ ...base, PORT }), /PORT/);
  }
});

test(".env is loaded relative to config.js and does not override host variables", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "discord-bot-config-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.copyFileSync(path.join(__dirname, "../config.js"), path.join(dir, "config.js"));
  fs.writeFileSync(path.join(dir, ".env"), "DISCORD_TOKEN=file-token\nPORT=4567\n");
  const script = `console.log(JSON.stringify(require(${JSON.stringify(path.join(dir, "config.js"))}).loadConfig()))`;
  const fromFile = spawnSync(process.execPath, ["-e", script], { cwd: os.tmpdir(), env: childEnv(), encoding: "utf8" });
  assert.equal(fromFile.status, 0, fromFile.stderr);
  assert.equal(JSON.parse(fromFile.stdout).token, "file-token");
  assert.equal(JSON.parse(fromFile.stdout).port, 4567);
  const fromHost = spawnSync(process.execPath, ["-e", script], { env: childEnv({ DISCORD_TOKEN: "host-token", PORT: "9876" }), encoding: "utf8" });
  assert.equal(fromHost.status, 0, fromHost.stderr);
  assert.equal(JSON.parse(fromHost.stdout).token, "host-token");
  assert.equal(JSON.parse(fromHost.stdout).port, 9876);
  fs.unlinkSync(path.join(dir, ".env"));
  const withoutFile = spawnSync(process.execPath, ["-e", script], { env: childEnv({ DISCORD_TOKEN: "host-token" }), encoding: "utf8" });
  assert.equal(withoutFile.status, 0, withoutFile.stderr);
});

test("offline check loads all bot modules from another working directory", () => {
  const result = spawnSync(process.execPath, [path.join(__dirname, "../main.js"), "--check"], {
    cwd: os.tmpdir(), env: childEnv({ DISCORD_TOKEN: "offline-test-token" }), encoding: "utf8", timeout: 10000,
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /No Discord connection/);
});

test("node . uses the real entry point and fails cleanly without configuration", () => {
  const result = spawnSync(process.execPath, ["."], {
    cwd: path.join(__dirname, ".."), env: childEnv(), encoding: "utf8", timeout: 10000,
  });
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /DISCORD_TOKEN/);
  assert.doesNotMatch(result.stderr, /MODULE_NOT_FOUND/);
});
