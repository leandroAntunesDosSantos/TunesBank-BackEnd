// table.increments('id').primary();
// table.string('agencia').notNullable();
// table.string('conta').notNullable();
// table.integer('usuario_id').unsigned().notNullable();
// table.foreign('usuario_id').references('usuarios.id');
// table.decimal('saldo', 14, 2).notNullable().defaultTo(0);
// table.timestamp('data_criacao').defaultTo(knex.fn.now());
const knex = require('../conexao');
const bcrypt = require('bcrypt');

function gerarNumeroConta() {
    const numeroConta = Math.floor(Math.random() * 99999) + 1;
    return numeroConta.toString().padStart(5, '0');
}


const criarContaBancaria = async (req, res) => {
    const { nome, email, senha } = req.body;
    const agencia = '001';
    const conta = gerarNumeroConta();
    const saldo = 0;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Preencha os campos obrigatórios: nome, email e senha." });
    }

    const usuarioEncontrado = await knex('conta_bancaria').where({ email }).first();
    if (usuarioEncontrado) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado." });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    try {
        let usuario = {
            nome,
            email,
            senha: senhaCriptografada,
            agencia,
            conta,
            saldo,
            data_criacao: new Date()
        }
        const novaConta = await knex('conta_bancaria').insert(usuario);

        if (!novaConta) {
            return res.status(400).json({ mensagem: "Não foi possível criar a conta bancária." });
        }
        return res.status(200).json({ mensagem: "Conta bancária criada com sucesso." });
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = { criarContaBancaria };