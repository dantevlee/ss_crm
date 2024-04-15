require('dotenv').config
const massive = require('massive');
const nodemailer = require('nodemailer')

const connectionString = process.env.DATABASE_URL; 

const dbPromise = massive({
    connectionString,
    ssl: false
}).then(db => {
    console.log('PostgreSQL connected');
    return db
}).catch(err => {
    console.error('Error connecting to PostgreSQL:', err);
});


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD
    }

})

module.exports = { dbPromise, transporter };