require('dotenv').config();
const { Client } = require('pg');
const knex = require('./src/conexao');

async function createDatabase() {
    const client = new Client({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: 'postgres', // Conecte-se ao banco de dados padrão
      port: Number(process.env.PGPORT),
      ssl: { rejectUnauthorized: false }
    });
  
    await client.connect();

    try {
      const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = 'tunesbankdatabase'`);
      if (res.rowCount === 0) {
        await client.query('CREATE DATABASE tunesbankdatabase');
        console.log('Banco de dados criado com sucesso');
      } else {
        console.log('Banco de dados já existe');
      }
    } catch (error) {
      console.error('Erro ao criar banco de dados:', error);
    } finally {
      await client.end();
    }
}

async function createTableContaBancaria() {
    try {
      const contaBancaria = await knex.schema.hasTable('conta_bancaria');
      if (contaBancaria) {
        console.log('Tabela "conta_bancaria" já existe');
        return;
      }
  
      await knex.schema.createTable('conta_bancaria', (table) => {
        table.increments('id').primary();
        table.string('nome').notNullable
        table.string('email').notNullable();
        table.string('senha').notNullable();
        table.string('agencia').notNullable();
        table.string('conta').notNullable();
        table.decimal('saldo', 14, 2).notNullable().defaultTo(0);
        table.timestamp('data_criacao').defaultTo(knex.fn.now());
      });
      console.log('Tabela "conta_bancaria" criada com sucesso!');
    } catch (error) {
      console.log(error.message);
    } finally {
      knex.destroy();
    }
  }

  async function createTableDepositos(){
    try {
      const depositos = await knex.schema.hasTable('depositos');
      if (depositos) {
        console.log('Tabela "depositos" já existe');
        return;
      }
  
      await knex.schema.createTable('depositos', (table) => {
        table.increments('id').primary();
        table.integer('contaDeposito_conta').unsigned().notNullable();
        table.foreign('contaDeposito_conta').references('conta_bancaria.conta');
        table.decimal('valor', 14, 2).notNullable();
        table.timestamp('data').defaultTo(knex.fn.now());
      });
      console.log('Tabela "depositos" criada com sucesso!');
    } catch (error) {
      console.log(error.message);
    } finally {
      knex.destroy();
    }
  } 


createDatabase()
createTableContaBancaria()
createTableDepositos()