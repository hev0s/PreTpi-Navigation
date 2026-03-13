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

export async function deleteUser(userId) {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [userId]);
    } catch (err) {
        console.error('Delete error:', err.message);
    }
}

export async function setFavoritePlace(userId, PlaceName, placeId) {
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

export async function getFavoritePlaces(userId) {
    try {
        const [rows] = await db.query(
            'SELECT id, label, address FROM saved_locations WHERE user_id = ?',
            [userId]
        );
        return rows;
    } catch (err) {
        console.error('Select error:', err.message);
        throw err;
    }
}

export async function deleteFavoritePlace(userId, placeId) {
    try {
        await db.query('DELETE FROM saved_locations WHERE user_id = ? AND id = ?', [userId, placeId]);
    } catch (err) {
        console.error('Delete error:', err.message);
    }
}

export async function postIncident(userId, typeId) {
    try {
        await db.query('INSERT INTO incidents (user_id, type_id) VALUES (?,?)', [userId, typeId]);
    } catch (err) {
        console.error('Insert error:', err.message);
    }
}