/**
 * @file Executes the Discord.js 'ping' interaction.
 * @version 1.0.0
 * @license AGPL-3.0-only
 *
 * Copyright (C) 2024 Allan Boswell
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
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
