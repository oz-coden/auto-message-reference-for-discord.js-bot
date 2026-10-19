const test = require("node:test");
const assert = require("node:assert/strict");
const { GatewayIntentBits, Collection } = require("discord.js");
const { createClient, commands } = require("../main.js");

function fixture({ publicChannel = true, source = "source", guildId = "1", bot = false } = {}) {
  const replies = [];
  const target = {
    id: "2", name: "target",
    permissionsFor: () => ({ has: () => publicChannel }),
    messages: { fetch: async () => ({
      author: { username: "tester", avatarURL: () => null },
      content: "quoted text", attachments: new Collection(), createdTimestamp: Date.now(),
    }) },
  };
  return {
    replies,
    message: {
      author: { bot }, content: "https://discord.com/channels/1/2/3", guildId,
      guild: { channels: { cache: new Collection([["2", target]]) }, roles: { everyone: {} }, iconURL: () => null },
      channel: { id: source }, reply: async (payload) => replies.push(payload),
    },
  };
}

test("client requires only the intents used by message quoting", async (t) => {
  const client = createClient();
  t.after(() => client.destroy());
  assert.equal(client.options.intents.bitfield, GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent);
  assert.deepEqual(commands.map((c) => c.name), ["ping"]);
});

test("quotes public links and same-channel private links; ignores prohibited links", async (t) => {
  const client = createClient();
  t.after(() => client.destroy());
  const handler = client.listeners("messageCreate")[0];
  for (const [options, count] of [
    [{}, 1], [{ publicChannel: false, source: "2" }, 1],
    [{ publicChannel: false }, 0], [{ guildId: "other" }, 0], [{ bot: true }, 0],
  ]) {
    const { message, replies } = fixture(options);
    await handler(message);
    assert.equal(replies.length, count);
    if (count) assert.equal(replies[0].embeds[0].toJSON().fields[0].value, "quoted text");
  }
});

test("reply rejection is handled inside the message listener", async (t) => {
  const client = createClient();
  t.after(() => client.destroy());
  const log = t.mock.method(console, "error", () => {});
  const { message } = fixture();
  message.reply = async () => { throw new Error("missing send permission"); };
  await client.listeners("messageCreate")[0](message);
  assert.equal(log.mock.callCount(), 1);
});
