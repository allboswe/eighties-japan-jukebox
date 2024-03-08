"use strict";

const EmbedBuilder = require("discord.js").EmbedBuilder;
const SlashCommandBuilder = require("discord.js").SlashCommandBuilder;

function pingEmbed(ws, rtt) {
  return new EmbedBuilder()
    .setColor("Green")
    .setTitle("Ping")
    .addFields(
      { name: "Round-Trip Latency", value: `${rtt}ms`, inline: true },
      { name: "Websocket Heartbeat", value: `${ws}ms`, inline: true },
    )
    .setDescription(`Measures the round-trip latency and websocket heartbeat.`);
}

function waitEmbed() {
  return new EmbedBuilder()
    .setColor("Default")
    .setTitle("Ping")
    .addFields(
      { name: "Round-Trip Latency", value: "0ms", inline: true },
      { name: "Websocket Heartbeat", value: "0ms", inline: true },
    )
    .setDescription("Measures the round-trip latency and websocket heartbeat.");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Measures the round-trip latency and websocket heartbeat."),
  global: false,
  async execute(interaction) {
    const ws = interaction.client.ws.ping;
    const sent = await interaction.reply({
      embeds: [waitEmbed()],
      ephemeral: false,
      fetchReply: true,
    });

    const rtt = sent.createdTimestamp - interaction.createdTimestamp;
    const embeds = [pingEmbed(ws, rtt)];

    return interaction.editReply({ embeds: embeds });
  },
};
