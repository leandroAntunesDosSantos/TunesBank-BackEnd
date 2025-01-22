const express = require("express");
const verificarUsuarioLogado = require("./intermediarios/autenticacao");
const { criarContaBancaria } = require("./controladores/ContaBancaria");
const { depositarDinheiro } = require("./controladores/Depositos");
const { transferirDinheiro } = require("./controladores/tranferencia");

const { login } = require("./controladores/login");

const rotas = express();

rotas.post("/conta", criarContaBancaria);

rotas.post("/login", login);

rotas.use(verificarUsuarioLogado);

rotas.post("/depositar", depositarDinheiro);
rotas.post("/transferir", transferirDinheiro);

module.exports = rotas;



