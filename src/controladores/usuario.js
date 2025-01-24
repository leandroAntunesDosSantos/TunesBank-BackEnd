const knex = require('../conexao');


const buscarInformacoesUsuario = async (req, res) => {

    try {
        const usuario = await knex('conta_bancaria').where({ id: req.usuario.id }).first();

        if (!usuario) {
            return res.status(404).json("Usuario não encontrado");
        }
        const { id, senha, ...dadosUsuario } = usuario;
        return res.status(200).json(dadosUsuario);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = {
    buscarInformacoesUsuario
}