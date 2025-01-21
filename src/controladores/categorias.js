const knex = require("../conexao");


const listarCategorias = async (req, res) => {
  try {
    const listaCategoria = await knex("categorias").select("*");
    return res.status(200).json(listaCategoria);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};

module.exports = {
  listarCategorias,
};
