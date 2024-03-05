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

mongoose.connect().then(() => {
  winston.container.info("Successfully connected to MongoDB Atlas.");
  application.connect();
});
