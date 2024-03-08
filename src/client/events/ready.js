"use strict";

const Events = require("discord.js").Events;

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    try {
      client.winston.info(`${client.user.tag} is ready.`);
    } catch (error) {
      client.winston.error(error.stack);
    }
  },
};
