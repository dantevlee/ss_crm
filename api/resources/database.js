require('dotenv').config
const massive = require('massive');

const connectionString = process.env.DATABASE_URL; 

module.exports = massive({
    connectionString,
    ssl: false
}).then(db => {
    console.log('PostgreSQL connected');
    return db
}).catch(err => {
    console.error('Error connecting to PostgreSQL:', err);
});
