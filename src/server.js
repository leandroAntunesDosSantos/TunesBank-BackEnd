require('dotenv').config();

const app = require('./index');

app.listen(process.env.PORT, () => {
  console.log(`O servidor está rodando na porta ${process.env.PORT}`);
});