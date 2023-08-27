const express = require('express')
require('dotenv').config()
const cors = require('cors')
const {dbConnection} = require('./database/config')


//Create el servidor de express
const app = express()

//Base de datos
dbConnection()

//CORS
app.use(cors())

//Directorio Publico
app.use( express.static('public'))

//Lecturas y parse del body
app.use( express.json() )

//Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

//Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
})