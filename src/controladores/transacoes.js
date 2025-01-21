const knex = require("../conexao");

const listarTransacoesLogado = async (req, res) => {
  try {
    const buscarTransacao = await knex("transacoes").where({
      usuario_id: req.usuario.id,
    });
    return res.status(200).json(buscarTransacao.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "ocorreu um erro" });
  }
};

const detalharTransacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await knex("transacoes").where({
      usuario_id: req.usuario.id,
    });
    const transacaoEspecifica = rows.filter((item) => {
      return item.id === Number(id);
    });
    if (!transacaoEspecifica) {
      return res.status(400).json({ mensagem: "Transação não encontrada." });
    }
    return res.status(200).json(transacaoEspecifica);
  } catch (error) {
    return res.status(500).json({ mensagem: "ocorreu um erro" });
  }
};

const cadastrarTransacao = async (req, res) => {
  try {
    const { tipo, descricao, data, valor, categoria_id } = req.body;
    if (!tipo || !descricao || !data || !valor || !categoria_id) {
      return res
        .status(400)
        .json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
    }
  
    if (tipo !== "entrada" && tipo !== "saida") {
      return res.json({ msg: "tipo invalido" });
    }
    const inserirTransacao = await knex("transacoes").insert({
      descricao,
      valor,
      data,
      categoria_id,
      usuario_id: req.usuario.id,
      tipo,
    });
    return res.status(201).json(inserirTransacao.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "ocorreu um erro" });
  }
};
const atualizarTransacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
      return res.status(400).json({
        mensagem: "Todos os campos obrigatórios devem ser informados.",
      });
    }
    const alterandoTransacao = await knex("transacoes")
      .where({ id: id })
      .update({
        descricao,
        valor,
        data,
        categoria_id,
        tipo,
      });
    return res.status(201).json(alterandoTransacao.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "ocorreu um erro" });
  }
};

const deletarTransacao = async (req, res) => {
  try {
    const { id } = req.params;
    const deletandoTransacao = await knex("transacoes").where({ id: id }).del();
    return res.status(201).json();
  } catch (error) {
    return res.status(500).json({ mensagem: "ocorreu um erro" });
  }
};

const verificarExtrato = async (req, res) => {
  try {
    const { rows } = await knex("transacoes").where({
      usuario_id: req.usuario.id,
    });
    const filtrarEntradas = rows.filter((item) => {
      return item.tipo === "entrada";
    });
    const filtrarSaidas = rows.filter((item) => {
      return item.tipo === "saida";
    });
    const totalEntradas = filtrarEntradas.reduce((total, item) => {
      return total + item.valor;
    }, 0);
    const totalSaidas = filtrarSaidas.reduce((total, item) => {
      return total - item.valor;
    }, 0);

    const extrato = {
      Entradas: totalEntradas,
      Saídas: totalSaidas,
    };
    return "pão com mortadela";
    return res.status(200).json(extrato);
  } catch (error) {
    return res.status(500).json({ mensagem: "ocorreu um erro" });
  }
};

module.exports = {
  listarTransacoesLogado,
  detalharTransacao,
  cadastrarTransacao,
  atualizarTransacao,
  deletarTransacao,
  verificarExtrato,
};
