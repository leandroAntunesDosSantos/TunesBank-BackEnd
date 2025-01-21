require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const cors = require("cors");
const rotas = require("./rotas");

const app = express();

app.use(cors());
app.use(express.json());
app.use(rotas);

app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
});

