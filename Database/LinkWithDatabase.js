import db from './ConnectToDatabase.js'

export async function createUser(username, password) {
    try {
        const [result] = await db.query(
            'INSERT INTO users (name, password) VALUES (?,?)',
            [username, password],
        );
        return result.insertId;
    } catch (err) {
        console.error('Insert error:', err.message);
        throw err;
    }
}
