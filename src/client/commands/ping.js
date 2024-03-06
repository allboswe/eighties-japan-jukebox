"use strict";

const SlashCommandBuilder = require("discord.js").SlashCommandBuilder;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Measures the round-trip latency and websocket heartbeat."),
  global: false,
  async execute(interaction) {},
};
