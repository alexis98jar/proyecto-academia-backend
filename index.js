const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

//Servidor de express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors());

//Directorio publico
app.use( express.static('public'));

//Lectura y parseo del body
app.use( express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));
    

//Escuchar peticion
app.listen(process.env.PORT, () => {
    console.log(`Servidor en puerto ${process.env.PORT}`)
})