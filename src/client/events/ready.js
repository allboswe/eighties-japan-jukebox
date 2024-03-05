"use strict";

const Events = require("discord.js").Events;

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    client.winston.info(`Successfully connected to Discord.`);
  },
};
