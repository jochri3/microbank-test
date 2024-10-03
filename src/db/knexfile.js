module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost", // Update with your DB host if it's not localhost
      user: "postgres", // Replace with your PostgreSQL user
      password: "postgres", // Replace with your PostgreSQL password
      database: "postgres", // Replace with your PostgreSQL database name
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
