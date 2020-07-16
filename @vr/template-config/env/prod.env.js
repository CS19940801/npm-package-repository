'use strict'
const STATIC_ENV = require("./index.js");
const STATIC_URL = JSON.stringify(STATIC_ENV.ConfList.static_url);
const VR_UI = JSON.stringify(STATIC_ENV.ConfList.vr_ui);

module.exports = {
  NODE_ENV: '"production"',
  BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
  STATIC_URL: STATIC_URL,
  VR_UI: VR_UI,
}
