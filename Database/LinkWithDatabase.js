import db from './ConnectToDatabase.js'

export async function createUser(username, password) {
    try {
        const [result] = await db.query(
            'INSERT INTO users (username, password) VALUES (?,?)',
            [username, password],
        );
        return result.insertId;
    } catch (err) {
        console.error('Insert error:', err.message);
        throw err;
    }
}

export async function getUserByUsername(username) {
    try {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    } catch (err) {
        console.error('Select error:', err.message);
        throw err;
    }
}

export async function SaveFavoritePlace(userId, PlaceName, placeId) {
    try {
        const [result] = await db.query(
            'INSERT INTO saved_locations (user_id, label, address) VALUES (?,?,?)',
            [userId, PlaceName, placeId]
        );
        return result.insertId;
    } catch (err) {
        console.error('Insert error:', err.message);
    }
}