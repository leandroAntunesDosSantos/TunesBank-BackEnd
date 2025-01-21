const jwt = require("jsonwebtoken");
const knex = require("../conexao");
const senhaSecreta = require("../senhaSecreta");

const verificarUsuarioLogado = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ msg: "não autorizado" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, senhaSecreta);

    const usuario = await knex("usuarios").where({ id }).first();

    if (!usuario) {
      return res.status(401).json({ msg: "não autorizado" });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "não autorizado" });
  }
};

module.exports = verificarUsuarioLogado;
