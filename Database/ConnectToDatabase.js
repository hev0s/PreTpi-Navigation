import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

db.getConnection()
    .then(connection => {
        console.log('Connecté à la base distante Swisscenter !');
        connection.release();
    })
    .catch(err => {
        console.error('Erreur critique de connexion base de données : ' + err.message);
    });

export default db;