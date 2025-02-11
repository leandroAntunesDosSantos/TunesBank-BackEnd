require("dotenv").config();

const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        port: Number(process.env.PGPORT),
        ssl: { rejectUnauthorized: false }
    },
    pool: {
        min: 2,
        max: 5
    },
    acquireConnectionTimeout: 10000
})
  
module.exports = knex;

