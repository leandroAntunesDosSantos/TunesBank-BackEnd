require("dotenv").config();

const knex = require("knex")({
    client: "mssql",
    connection: {
        server: process.env.DB_SERVER,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        options: {
            encrypt: true, // Use true if you're on Azure
            enableArithAbort: true
        }
    },
    pool: {
        min: 2,
        max: 10
    },
    acquireConnectionTimeout: 10000, 
})
  
module.exports = knex;


