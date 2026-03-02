import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.../.env') });

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit : 0
});

const testConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log('Connecté à la base distante Swisscenter !');
        connection.release();
    } catch (err) {
        console.error('Erreur de connexion : ' + err.message);
    }
};

testConnection();

export default db;