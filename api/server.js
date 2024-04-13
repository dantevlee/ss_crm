const express = require('express')
require('dotenv').config()
const app = express()
const server = require('http').createServer(app)
const port = process.env.PORT || 3000;
const cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api', require('./routes/Users'))

server.listen(port, () =>console.log(`Server is listening on ${port}.`))