/**
 * @file Executes the Discord.js 'tracks' interaction.
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
const PermissionFlagsBits = require("discord.js").PermissionFlagsBits;
const SlashCommandBuilder = require("discord.js").SlashCommandBuilder;

function added(metadata) {
  const str1 = `[${metadata.title}](${metadata.url} '${metadata.title}') by `;
  const str2 = `${metadata.artist} has been added.`;

  return new EmbedBuilder()
    .setColor("Green")
    .setTitle("Added!")
    .setThumbnail(metadata.album_image)
    .setDescription(str1 + str2)
    .setTimestamp();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tracks")
    .setDescription("Performs track management.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Adds track information to the database.")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("Enter the track's url.")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("Enter the track' title.")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("artist")
            .setDescription("Enter the track's artist.")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("album-image")
            .setDescription("Enter the track's album image url.")
            .setRequired(true),
        ),
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  global: false,
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "add") {
      const metadata = {
        url: interaction.options.getString("url"),
        title: interaction.options.getString("title"),
        artist: interaction.options.getString("artist"),
        album_image: interaction.options.getString("album-image"),
      };

      const document = await interaction.client.mongoose.insertTrack(metadata);

      if (document)
        return await interaction.reply({
          embeds: [added(metadata)],
          ephemeral: true,
          fetchReply: false,
        });
    }
  },
};
