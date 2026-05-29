// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '12345678',
      database: 'db_doceria_ianes',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};