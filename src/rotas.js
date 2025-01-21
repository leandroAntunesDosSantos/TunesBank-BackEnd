const express = require("express");
const verificarUsuarioLogado = require("./intermediarios/autenticacao");

const {
  cadastrarUsuario,
  login,
  detalharPerfilUsuario,
  atualizarPerfilUsuario,
} = require("./controladores/usuarios");



const { listarCategorias } = require("./controladores/categorias");

const {
  listarTransacoesLogado,
  detalharTransacao,
  cadastrarTransacao,
  atualizarTransacao,
  deletarTransacao,
  verificarExtrato,
} = require("./controladores/transacoes");

const rotas = express();

rotas.get("/categoria", listarCategorias);
rotas.post("/usuario", cadastrarUsuario);
rotas.post("/login", login);

rotas.use(verificarUsuarioLogado);

rotas.get("/transacao/extrato", verificarExtrato);

rotas.get("/usuario", detalharPerfilUsuario);
rotas.put("/usuario", atualizarPerfilUsuario);
rotas.get("/transacao", listarTransacoesLogado);
rotas.get("/transacao/:id", detalharTransacao);
rotas.post("/transacao", cadastrarTransacao);
rotas.put("/transacao/:id", atualizarTransacao);
rotas.delete("/transacao/:id", deletarTransacao);

module.exports = rotas;



