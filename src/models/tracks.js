"use strict";

const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      unique: false,
      required: true,
    },
    artist: {
      type: String,
      unique: false,
      required: true,
    },
    album_image: {
      type: String,
      unique: false,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("tracks", trackSchema);
