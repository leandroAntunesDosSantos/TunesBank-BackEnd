const bcript = require("bcrypt");
const knex = require("../conexao");
const jwt = require("jsonwebtoken");
const senhaSecreta = require("../senhaSecreta");


const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      mensagem: "Preencha os campos obrigatórios: nome, email e senha",
    });
  }

  try {
    const usuarioEncontrado = await knex("usuarios").where({ email }).first();

    if (usuarioEncontrado) {
      return res.status(400).json({ mensagem: "E-mail já cadastrado" });
    }

    const senhaCriptografada = await bcript.hash(senha, 10);

    const novoUsuario = {
      nome,
      email,
      senha: senhaCriptografada,
    };

    const usuarioInserido = await knex("usuarios").insert(novoUsuario).returning("*");

    return res.status(201).json(usuarioInserido[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "Preencha os campos obrigatórios: email e senha",
    });
  }

  try {
    const usuario = await knex("usuarios").where({ email }).first();

    if (!usuario) {
      return res.status(404).json({ msg: "email ou senha invalido" });
    }

    const senhaValida = await bcript.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ msg: "email ou senha invalido" });
    }

    const token = jwt.sign({ id: usuario.id }, senhaSecreta, {
      expiresIn: "8h",
    });

    const { senha: _, ...usuarioLogado } = usuario;
    return res.status(200).json({ usuario: usuarioLogado, token });
  } catch (erro) {
    console.log(erro.message);
    return res.status(500).json({ mensagem: "ocorreu um erro"});
  }
};

const detalharPerfilUsuario = async (req, res) => {
  const { id, nome } = req.usuario;

  try {
    const perfil = {
      id,
      nome,
    };
    return res.status(200).json(perfil);
  } catch (error) {
    return res.status(500).json({ mensagem: "ocorreu um erro" });
  }
};

const atualizarPerfilUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Preencha todos os campos obrigatórios" });
  }
  try {
    const buscaUsuario = await knex("usuarios").where({ email }).first();
    
    if (buscaUsuario) {
      return res.status(400).json({ mensagem: "Email já cadastrado" });
    }

    const senhaCriptografadaUpdate = await bcript.hash(senha, 10);

    await knex("usuarios")
      .where({ id: req.usuario.id })
      .update({ nome, email, senha: senhaCriptografadaUpdate });
      
    return res.status(201).json();
  } catch (erro) {
    return res.status(500).json(erro);
  }
};

module.exports = {
  cadastrarUsuario,
  login,
  detalharPerfilUsuario,
  atualizarPerfilUsuario,
};
