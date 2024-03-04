"use strict";

require("./utils/dotenv");

const { Winston } = require("./utils/winston");
const { Mongoose } = require("./utils/mongoose");

const { Application } = require("./client/discord");

const winston = new Winston();
const mongoose = new Mongoose();

const application = new Application(winston.container, mongoose.container);
