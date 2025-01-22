const express = require("express");
const verificarUsuarioLogado = require("./intermediarios/autenticacao");
const { criarContaBancaria } = require("./controladores/ContaBancaria");
const { depositarDinheiro } = require("./controladores/Depositos");

const {
  cadastrarUsuario,
  login,
  detalharPerfilUsuario,
  atualizarPerfilUsuario,
} = require("./controladores/usuarios");

const rotas = express();

rotas.post("/usuario", cadastrarUsuario);
rotas.post("/conta", criarContaBancaria);


rotas.post("/login", login);

rotas.use(verificarUsuarioLogado);

rotas.post("/depositar", depositarDinheiro);


rotas.get("/usuario", detalharPerfilUsuario);
rotas.put("/usuario", atualizarPerfilUsuario);


module.exports = rotas;



