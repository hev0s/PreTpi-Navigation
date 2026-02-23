import express from 'express';
import bcrypt from 'bcrypt';
import { createUser } from "../Database/LinkWithDatabase.js"; // Ajout des accolades

const router = express.Router();
const SALT_ROUNDS = 10;


router.use(express.json());

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const userId = await createUser(username, hashedPassword);
        res.status(201).json({ success: true, userId: userId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;