require('dotenv').config();

const sql = require('mssql');

async function createDatabase() {
  try {
    await sql.connect(process.env.CONNECTION_STRING);
    await sql.query`
      IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'database-tunesbank')
      BEGIN
        CREATE DATABASE [database-tunesbank];
      END
    `;
    console.log('Database created successfully');
    sql.close();
  } catch (err) {
    console.log('Error creating database:', err);
  }
}

async function createTableUsuarios(){
    try {
        await sql.connect(process.env.CONNECTION_STRING);
        await sql.query`
        USE [database-tunesbank];
        CREATE TABLE usuarios (
            id INT IDENTITY(1,1) PRIMARY KEY,
            nome NVARCHAR(255) NOT NULL,
            email NVARCHAR(255) UNIQUE NOT NULL,
            senha NVARCHAR(255) NOT NULL
        );
        `;
        console.log('Table created successfully');
        sql.close();
    } catch (err) {
        console.log('Error creating table:', err);
    }
} 

async function createTableCategorias(){
    try {
        await sql.connect(process.env.CONNECTION_STRING);
        await sql.query`
        USE [database-tunesbank];
        CREATE TABLE categorias (
            id INT IDENTITY(1,1) PRIMARY KEY,
            descricao NVARCHAR(255) NOT NULL
        );
        `;
        console.log('Table created successfully');
        sql.close();
    } catch (err) {
        console.log('Error creating table:', err);
    }
}

async function createTableTransacoes(){
    try {
        await sql.connect(process.env.CONNECTION_STRING);
        await sql.query`
        USE [database-tunesbank];
        CREATE TABLE transacoes (
            id INT IDENTITY(1,1) PRIMARY KEY,
            descricao NVARCHAR(MAX),
            valor INT,
            data NVARCHAR(MAX),
            categoria_id INT NOT NULL FOREIGN KEY REFERENCES categorias(id),
            usuario_id INT NOT NULL FOREIGN KEY REFERENCES usuarios(id),
            tipo NVARCHAR(MAX)
        );
        `;
        console.log('Table created successfully');
        sql.close();
    } catch (err) {
        console.log('Error creating table:', err);
    }
}

async function inserirCategorias(){
    try {
        await sql.connect(process.env.CONNECTION_STRING);
        await sql.query`
        USE [database-tunesbank];
        INSERT INTO categorias (descricao) VALUES
        ('Alimentação'),
        ('Assinaturas e Serviços'),
        ('Casa'),
        ('Mercado'),
        ('Cuidados Pessoais'),
        ('Educação'),
        ('Família'),
        ('Lazer'),
        ('Pets'),
        ('Presentes'),
        ('Roupas'),
        ('Saúde'),
        ('Transporte'),
        ('Salário'),
        ('Vendas'),
        ('Outras receitas'),
        ('Outras despesas');
        `;
        console.log('Table created successfully');
        sql.close();
    } catch (err) {
        console.log('Error creating table:', err);
    }
}

createDatabase();
createTableUsuarios();
createTableCategorias();
createTableTransacoes();
inserirCategorias();
    