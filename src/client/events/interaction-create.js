/**
 * @file Executes the Discord.js 'interaction create' event.
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

const Events = require("discord.js").Events;
const EmbedBuilder = require("discord.js").EmbedBuilder;

function errorEmbed() {
  return new EmbedBuilder()
    .setColor("Red")
    .setTitle("Oh no!")
    .setTimestamp()
    .setDescription("An error has occurred while executing this command.");
}

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    try {
      if (!interaction.isChatInputCommand()) return null;

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return null;
      else return await command.execute(interaction);
    } catch (error) {
      interaction.client.winston.error(error.stack);

      if (interaction.replied || interaction.deferred) {
        return await interaction.followUp({
          embeds: [errorEmbed()],
          ephemeral: true,
        });
      } else {
        return await interaction.reply({
          embeds: [errorEmbed()],
          ephemeral: true,
        });
      }
    }
  },
};
