"use strict";

const Client = require("discord.js").Client;
const GatewayIntentBits = require("discord.js").GatewayIntentBits;

class Application {
  constructor(winston, mongoose) {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.client.winston = winston;
    this.client.mongoose = mongoose;
  }
}

module.exports = { Application };
