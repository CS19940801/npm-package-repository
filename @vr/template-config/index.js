const env = require("./env/index")
const wp_dev_env = require("./env/dev.env")
const wp_prod_env = require("./env/prod.env")

module.exports = {
    env: env,
    wp_dev_env,
    wp_prod_env
}