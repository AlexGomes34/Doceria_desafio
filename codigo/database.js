const knex = require('knex')
const config = require('./knex.js')

const db = knex(config.development)

module.exports = db