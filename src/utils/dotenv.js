"use strict";

const path = require("node:path");

const { config } = require("dotenv");
const { expand } = require("dotenv-expand");

const result = config({
  path: path.join(__dirname, "..", "..", "private", ".env"),
});

if (result.error) throw result.error;
else expand(result);
