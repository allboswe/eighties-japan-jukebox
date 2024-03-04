/**
 * @file Initializes the necessary environment variables.
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

const path = require("node:path");

const { config } = require("dotenv");
const { expand } = require("dotenv-expand");

const result = config({
  path: path.join(__dirname, "..", "..", "private", ".env"),
});

if (result.error) throw result.error;
else expand(result);
