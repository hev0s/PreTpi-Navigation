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

export async function setFavoritePlace(userId, placeName, address, latitude, longitude) {
    try {
        const [result] = await db.query(
            'INSERT INTO saved_locations (user_id, label, address, latitude, longitude) VALUES (?,?,?,?,?)',
            [userId, placeName, address, latitude, longitude]
        );
        return result.insertId;
    } catch (err) {
        console.error('Insert error:', err.message);
        throw err;
    }
}

export async function getFavoritePlaces(userId) {
    try {
        const [rows] = await db.query(
            'SELECT id, label, address, latitude, longitude FROM saved_locations WHERE user_id = ?',
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

export async function postIncident(userId, typeId, latitude, longitude, description = null) {
    try {
        const [result] = await db.query(
            'INSERT INTO incidents (user_id, type_id, latitude, longitude, description) VALUES (?,?,?,?,?)',
            [userId, typeId, latitude, longitude, description]
        );
        return result.insertId;
    } catch (err) {
        console.error('Insert incident error:', err.message);
        throw err;
    }
}

export async function getActiveIncidents() {
    try {
        const [rows] = await db.query(
            `SELECT i.id, i.latitude, i.longitude, i.description, t.label as type, i.created_at
             FROM incidents i
                      JOIN incident_types t ON i.type_id = t.id
             WHERE i.is_active = TRUE`
        );
        return rows;
    } catch (err) {
        console.error('Select incidents error:', err.message);
        throw err;
    }
}

export async function deactivateIncident(incidentId) {
    try {
        await db.query('UPDATE incidents SET is_active = FALSE WHERE id = ?', [incidentId]);
    } catch (err) {
        console.error('Deactivate incident error:', err.message);
    }
}