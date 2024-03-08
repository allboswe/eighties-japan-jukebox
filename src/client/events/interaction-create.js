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
