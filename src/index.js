/**
 * @file Initializes the application.
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

/** @throws {Error} ENOENT: if no such file or directory exists. */
require("./utils/dotenv");

const { Winston } = require("./utils/winston");
const { Mongoose } = require("./utils/mongoose");
const { Application } = require("./client/discord");

const winston = new Winston();
const mongoose = new Mongoose();
const application = new Application(winston.container, mongoose);

process.on("SIGINT", function () {
  winston.container.warn("`SIGINT` detected.");
  application.disconnect().then(() => {
    winston.container.info("Successfully disconnected from Discord.");
    mongoose.disconnect().then(() => {
      winston.container.info("Successfully disconnected from MongoDB Atlas.");
    });
  });
});

process.on("uncaughtException", function (error) {
  winston.container.error(error.stack);
  application.disconnect().then(() => {
    winston.container.info("Successfully disconnected from Discord.");
    mongoose.disconnect().then(() => {
      winston.container.info("Successfully disconnected from MongoDB Atlas.");
    });
  });
});

process.on("unhandledRejection", function (error) {
  winston.container.error(error.stack);
  application.disconnect().then(() => {
    winston.container.info("Successfully disconnected from Discord.");
    mongoose.disconnect().then(() => {
      winston.container.info("Successfully disconnected from MongoDB Atlas.");
    });
  });
});

application.registerApplicationCommands().then(() => {
  winston.container.info("Successfully registered application commands.");
  mongoose.connect().then(() => {
    winston.container.info("Successfully connected to MongoDB Atlas.");
    application.connect().then(() => {
      winston.container.info("Successfully connected to Discord.");
    });
  });
});
