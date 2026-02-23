import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Part for SQL scripts
import authRoutes from "./routes/auth.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/auth.html'));
});

// API
app.use('/api', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré : http://localhost:${PORT}`);
});