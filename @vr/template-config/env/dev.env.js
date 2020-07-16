'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const STATIC_ENV = require("./index.js");
const STATIC_URL = JSON.stringify(STATIC_ENV.ConfList.static_url);
const VR_UI = JSON.stringify(STATIC_ENV.ConfList.vr_ui);

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV: JSON.stringify(process.env.ENV),
  STATIC_URL: STATIC_URL,
  VR_UI: VR_UI,
})
