"use strict";

const winston = require("winston");

class Winston {
  #level = process.env.NODE_ENV === "development" ? "debug" : "info";
  #format = winston.format.json();
  #levels = winston.config.npm.levels;
  #silent = false;
  #transports = [];
  #exitOnError = false;

  constructor() {
    this.container = winston.createLogger({
      level: this.#level,
      format: this.#format,
      levels: this.#levels,
      silent: this.#silent,
      transports: this.#transports,
      exitOnError: this.#exitOnError,
    });

    if (process.env.NODE_ENV === "development")
      this.container.add(this.#console());
  }

  #console() {
    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level.toUpperCase()}] ${message}`;
        }),
        winston.format.colorize({ all: true }),
      ),
    });
  }
}

module.exports = { Winston };
