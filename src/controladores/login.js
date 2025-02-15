const bcript = require("bcrypt");
const knex = require("../conexao");
const jwt = require("jsonwebtoken");
const senhaSecreta = require("../senhaSecreta");

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "Preencha os campos obrigatórios: email e senha",
    });
  }

  try {
    const buscarConta = await knex("conta_bancaria").where({ email }).first();

    if (!buscarConta) {
      return res.status(400).json({ mensagem: "email ou senha invalido" });
    }
    const senhaValida = await bcript.compare(senha, buscarConta.senha);

    if (!senhaValida) {
      return res.status(400).json({ mensagem: "email ou senha invalido" });
    }

    const token = jwt.sign({ id: buscarConta.id }, senhaSecreta, {
      expiresIn: "8h",
    });
    return res.status(200).json({ token });
  } catch (erro) {
    return res.status(500).json({ mensagem: "ocorreu um erro"});
  }
};

module.exports = {
  login,
};

