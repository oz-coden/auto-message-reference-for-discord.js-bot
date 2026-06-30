const express = require("express");
const app = express();
const { Client, GatewayIntentBits } = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const commands = [
  {
    name: "ping",
    description: "Reply \"Pong!\" and report the current delay.",
  },
];

app.listen(3000, () => {
  console.log("Program is running!");
});
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
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

    message.reply({
      embeds: [embed],
      files: attachmentUrls,
    });
  } catch (error) {
    console.error("Failed to reference message: ", error);
  }
});

client.once("clientReady", async () => {
  await client.application.commands.set(commands);
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName == "ping") {
    const embed = new EmbedBuilder()
      .setColor([0, 0, 255])
      .setTitle("Pong!")
      .addFields({ name: "Result", value: client.ws.ping + "ms." })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.token);
