CREATE DATABASE database-tunesbank;

USE database-tunesbank;

CREATE TABLE usuarios (
  id INT IDENTITY(1,1) PRIMARY KEY,
  nome NVARCHAR(MAX),
  email NVARCHAR(MAX) UNIQUE,
  senha NVARCHAR(MAX)
);

CREATE TABLE categorias (
  id INT IDENTITY(1,1) PRIMARY KEY,
  descricao NVARCHAR(MAX)
);

CREATE TABLE transacoes (
  id INT IDENTITY(1,1) PRIMARY KEY,
  descricao NVARCHAR(MAX),
  valor INT,
  data NVARCHAR(MAX),
  categoria_id INT NOT NULL FOREIGN KEY REFERENCES categorias(id),
  usuario_id INT NOT NULL FOREIGN KEY REFERENCES usuarios(id),
  tipo NVARCHAR(MAX)
);

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


