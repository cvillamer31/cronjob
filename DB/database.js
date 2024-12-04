const mysql = require('mysql2/promise');
require('dotenv').config();
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD_DB,
            database: process.env.DB,
            port: 5013,
        });
        console.log('Connected to MySQL!');
        return connection;
    } catch (err) {
        console.error('Failed to connect to MySQL:', err.message);
        throw err;
    }
}
module.exports = { connectToDatabase };