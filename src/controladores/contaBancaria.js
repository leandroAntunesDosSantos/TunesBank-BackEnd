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
        return res.status(201).json({ mensagem: "Conta bancária criada com sucesso." });
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

const depositarDinheiro = async (req, res) => {
    const { conta } = req.usuario;
    const data = new Date();
    const { valor } = req.body;

    if (!valor) {
        return res.status(400).json({ mensagem: "O campo valor é obrigatório." });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor deve ser maior que zero." });
    }

    const deposito = {
        contaDeposito_conta: conta,
        valor : valor,
        data: data
    }

    try {
        const novoDeposito = await knex('depositos').insert(deposito);
        const alterarValorSaldo = await knex('conta_bancaria').where({ conta }).increment('saldo', valor);
        if (!novoDeposito || !alterarValorSaldo) {
            return res.status(400).json({ mensagem: "Não foi possível realizar o depósito." });
        }
        return res.status(200).json({ mensagem: "Depósito realizado com sucesso." });
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

const transferirDinheiro = async (req, res) => {
    const { conta } = req.usuario;
    const { contaDestino, valor } = req.body;

    if (!contaDestino || !valor) {
        return res.status(400).json({ mensagem: "Os campos contaDestino e valor são obrigatórios." });
    }

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "O valor deve ser maior que zero." });
    }

    if (conta === contaDestino) {
        return res.status(400).json({ mensagem: "Não é possível transferir para a mesma conta." });
    }

    const contaOrigem = await knex('conta_bancaria').where({ conta }).first();
    const contaDestinoEncontrada = await knex('conta_bancaria').where({ conta: contaDestino }).first();

    if (!contaDestinoEncontrada) {
        return res.status(400).json({ mensagem: "Conta de destino não encontrada." });
    }

    if (Number(contaOrigem.saldo) < Number(valor)) {
        return res.status(400).json({ mensagem: "Saldo insuficiente." });
    }

    const transferencia = {
        contaOrigem_conta: conta,
        contaDestino_conta: contaDestino,
        valor: Number(valor),
        data: new Date()
    }

    try {
        const novaTransferencia = await knex('transferirDinheiro').insert(transferencia);
        const debitarContaOrigem = await knex('conta_bancaria').where({ conta }).decrement('saldo', Number(valor));
        const creditarContaDestino = await knex('conta_bancaria').where({ conta: contaDestino }).increment('saldo', Number(valor));

        if (!novaTransferencia || !debitarContaOrigem || !creditarContaDestino) {
            return res.status(400).json({ mensagem: "Não foi possível realizar a transferência." });
        }
        return res.status(200).json({ mensagem: "Transferência realizada com sucesso." });
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const consultarExtrato = async (req, res) => {
    const { conta } = req.usuario;

    try {
        const depositos = await knex('depositos').where({ contaDeposito_conta: conta }).select('*');
        const transferenciasEnviadas = await knex('transferirDinheiro').where({ contaOrigem_conta: conta }).select('*');
        const transferenciasRecebidas = await knex('transferirDinheiro').where({ contaDestino_conta: conta }).select('*');

        return res.status(200).json({ depositos, transferenciasEnviadas, transferenciasRecebidas });
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}


module.exports = { criarContaBancaria, depositarDinheiro, transferirDinheiro, consultarExtrato };