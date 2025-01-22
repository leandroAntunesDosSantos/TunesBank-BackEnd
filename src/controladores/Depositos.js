const knex = require('../conexao');


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

module.exports = { depositarDinheiro };


