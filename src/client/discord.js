/**
 * @file Initializes the Discord.js client.
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

const fs = require("node:fs");
const path = require("node:path");

const REST = require("discord.js").REST;
const Client = require("discord.js").Client;
const Routes = require("discord.js").Routes;
const Collection = require("discord.js").Collection;
const GatewayIntentBits = require("discord.js").GatewayIntentBits;

class Application {
  constructor(winston, mongoose) {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.client.winston = winston;
    this.client.commands = new Collection();
    this.client.mongoose = mongoose;

    this.#requireEvents();
    this.#requireCommands();
  }

  /**
   * @private
   * @returns {void}
   */
  #requireEvents() {
    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);

      if (event.once)
        this.client.once(event.name, (...args) => event.execute(...args));
      else this.client.on(event.name, (...args) => event.execute(...args));

      this.client.winston.debug(`Event \`${file}\` initialized.`);
    }
  }

  /**
   * @private
   * @returns {void}
   */
  #requireCommands() {
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      this.client.commands.set(command.data.name, command);
      this.client.winston.debug(`Command \`${file}\` initialized.`);
    }
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async registerApplicationCommands() {
    const clientId = process.env.DISCORD_APPID;
    const serverId = process.env.DISCORD_GUILD;

    const commands = { local: [], global: [] };
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if (command.global) commands.global.push(command.data.toJSON());
      else commands.local.push(command.data.toJSON());
    }

    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    await rest.put(Routes.applicationCommands(process.env.DISCORD_APPID), {
      body: commands.global,
    });

    await rest.put(Routes.applicationGuildCommands(clientId, serverId), {
      body: commands.local,
    });
  }

  /**
   * @public
   * @returns {Promise<string>}
   */
  async connect() {
    return await this.client.login(process.env.DISCORD_TOKEN);
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async disconnect() {
    return await this.client.destroy();
  }
}

module.exports = { Application };
