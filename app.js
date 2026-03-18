import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Part for SQL scripts
import authRoutes from "./routes/auth.js";
import navigationRoutes from "./routes/navigation.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: 'https://tpi26nde.mycpnv.ch', // L'URL du front-end
    credentials: true
}));

// Le dossier des images
app.use('/images', express.static(path.join(__dirname, 'Docs/Images/Edited')));

// Le dossier des scripts frontend (dictionnaire langues)
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// API
app.use('/api', authRoutes);
app.use('/api/navigation', navigationRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré : http://localhost:${PORT}`);
});