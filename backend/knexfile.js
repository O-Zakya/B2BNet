// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host:     process.env.DB_HOST     || '127.0.0.1',
      port:     process.env.DB_PORT     || 3306,
      user:     process.env.DB_USER     || 'b2bnet',
      password: process.env.DB_PASSWORD || 'B-!too!-BNET1234@',
      database: process.env.DB_NAME     || 'B2BNet_db'
    },
    migrations: {
      directory: './migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host:     process.env.DB_HOST     || '127.0.0.1',
      port:     process.env.DB_PORT     || 3306,
      user:     process.env.DB_USER     || 'b2bnet',
      password: process.env.DB_PASSWORD || 'B-!too!-BNET1234@',
      database: process.env.DB_NAME     || 'B2BNet_db'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    }
  }

};
