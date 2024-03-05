"use strict";

const fs = require("node:fs");
const path = require("node:path");

const Client = require("discord.js").Client;
const GatewayIntentBits = require("discord.js").GatewayIntentBits;

class Application {
  constructor(winston, mongoose) {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.client.winston = winston;
    this.client.mongoose = mongoose;

    this.#registerEvents();
  }

  #registerEvents() {
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
    }
  }

  async connect() {
    return await this.client.login(process.env.DISCORD_TOKEN);
  }

  async disconnect() {
    return await this.client.destroy();
  }
}

module.exports = { Application };
