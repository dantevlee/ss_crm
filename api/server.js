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
app.use('/api', require('./routes/Clients'))
app.use('/api', require('./routes/Archives'))
app.use('/api', require('./routes/Leads'))
app.use('/api', require('./routes/ClientNotes'))
app.use('/api', require('./routes/ClientFiles'))
app.use('/api', require('./routes/ArchiveNotes'))
app.use('/api', require('./routes/ArchiveFiles'))
app.use('/api', require('./routes/LeadNotes'))


server.listen(port, () =>console.log(`Server is listening on ${port}.`))