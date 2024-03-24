/**
 * @file Initializes the object modeling utility.
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

const mongoose = require("mongoose");

const Track = require("../models/tracks");

class Mongoose {
  constructor() {}

  /**
   * Returns `{ ok: 1 }` if connected to the cloud database.
   *
   * @see {@link https://www.npmjs.com/package/mongoose}
   * @since 1.0.0
   * @public
   * @returns {Promise<mongoose.mongo.BSON.Document>}
   */
  async ping() {
    return await mongoose.connection.db.admin().command({ ping: 1 });
  }

  /**
   * Connects to the cloud database.
   *
   * @see {@link https://www.npmjs.com/package/mongoose}
   * @since 1.0.0
   * @public
   * @returns {Promise<typeof mongoose>}
   */
  async connect() {
    const uri = process.env.MONGODB_ATLAS;
    const options = {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    };

    return await mongoose.connect(uri, options);
  }

  /**
   * Disconnects from the cloud database.
   *
   * @see {@link https://www.npmjs.com/package/mongoose}
   * @since 1.0.0
   * @public
   * @returns {Promise<void>}
   */
  async disconnect() {
    return await mongoose.disconnect();
  }

  async insertTrack(metadata) {
    const track = new Track(metadata);

    return await track.save();
  }
}

module.exports = { Mongoose };
