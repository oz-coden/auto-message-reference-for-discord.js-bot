const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { loadConfig } = require("./config.js");
const { startBot } = require("./runtime.js");

const commands = [
  {
    name: "ping",
    description: "Reply \"Pong!\" and report the current delay.",
  },
];

function createClient() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const urlPattern = /discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
    const match = message.content.match(urlPattern);

    if (!match) return;

    const [, serverId, channelId, messageId] = match;

    if (message.guildId !== serverId) return;

    try {
      const targetChannel = message.guild.channels.cache.get(channelId);
      if (!targetChannel) return;
      const sourceChannel = message.channel;
      const everyoneRole = message.guild.roles.everyone;
      const targetIsPublic = targetChannel
        .permissionsFor(everyoneRole)
        .has("ViewChannel");

      if (!targetIsPublic) {
        if (targetChannel.id !== sourceChannel.id) return;
      }

      const messageData = await targetChannel.messages.fetch(messageId);
      if (!messageData) return;

      const attachmentUrls = messageData.attachments.map(
        (attachment) => attachment.url,
      );

      const embed = new EmbedBuilder()
        .setColor([31, 31, 31])
        .setAuthor({
          name: messageData.author.username,
          iconURL: messageData.author.avatarURL(),
        })
        .addFields({
          name: "Auto-Message-Reference",
          value: messageData.content || "(NO CONTEXT PROVIDED)",
        })
        .setFooter({ text: targetChannel.name, iconURL: message.guild.iconURL() })
        .setTimestamp(messageData.createdTimestamp);

      await message.reply({
        embeds: [embed],
        files: attachmentUrls,
      });
    } catch (error) {
      console.error("Failed to reference message:", error.message);
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
      if (interaction.commandName == "ping") {
        const embed = new EmbedBuilder()
          .setColor([0, 0, 255])
          .setTitle("Pong!")
          .addFields({ name: "Result", value: client.ws.ping + "ms." })
          .setTimestamp();
        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Failed to handle interaction:", error.message);
    }
  });

  return client;
}

async function main() {
  let config;
  try {
    config = loadConfig();
  } catch (error) {
    console.error("Configuration error:", error.message);
    process.exitCode = 1;
    return;
  }
  if (process.argv.includes("--check")) {
    const client = createClient();
    await client.destroy();
    console.log("Configuration and bot modules are valid. No Discord connection was made.");
    return;
  }
  await startBot({ client: createClient(), commands, config });
}

if (require.main === module) {
  main().catch((error) => {
    // Do not print Discord request objects: they may contain credentials.
    console.error("Bot startup failed:", error.code || error.name);
    console.error("Check DISCORD_TOKEN, PORT, the .env file, network access, and the Discord Developer Portal settings.");
    process.exitCode = 1;
  });
}

module.exports = { createClient, commands };
