const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const cors = require('cors');
require('./config/connect-db'); // Asumiendo que este es el archivo que contiene tu conexión a MongoDB



dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});