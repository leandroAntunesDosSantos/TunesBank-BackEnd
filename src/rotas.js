const express = require("express");

const { buscarInformacoesUsuario } = require("./controladores/usuario");
const { criarContaBancaria, depositarDinheiro, transferirDinheiro } = require("./controladores/ContaBancaria");
const { login } = require("./controladores/login");

const verificarUsuarioLogado = require("./intermediarios/autenticacao");

const rotas = express();

rotas.post("/conta", criarContaBancaria);
rotas.post("/login", login);

rotas.use(verificarUsuarioLogado);

rotas.get("/conta", buscarInformacoesUsuario);
rotas.post("/depositar", depositarDinheiro);
rotas.post("/transferir", transferirDinheiro);

module.exports = rotas;



