const knex = require('../conexao');


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

module.exports = { transferirDinheiro };

