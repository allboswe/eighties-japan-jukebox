/**
 * @file Initializes the logging utility.
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

const winston = require("winston");

class Winston {
  constructor() {
    this.container = winston.createLogger({
      level: process.env.NODE_ENV === "development" ? "debug" : "info",
      format: winston.format.json(),
      levels: winston.config.npm.levels,
      silent: false,
      transports: [],
      exitOnError: false,
    });

    if (process.env.NODE_ENV === "development")
      this.container.add(this.#setConsoleTransport());
  }

  /**
   * Returns an instance of a console transport.
   *
   * @see {@link https://www.npmjs.com/package/winston}
   * @since 1.0.0
   * @private
   * @returns {winston.transports.ConsoleTransportInstance}
   */
  #setConsoleTransport() {
    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level.toUpperCase()}] ${message}`;
        }),
        winston.format.errors({ stack: true }),
        winston.format.colorize({ all: true }),
      ),
    });
  }
}

module.exports = { Winston };
