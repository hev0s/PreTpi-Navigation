import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Vérification du token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ error: 'Aucun token fourni' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token invalide' });
        req.userId = decoded.userId;
        next();
    });
};

// Geocodage avec adresse
router.post('/geocode', verifyToken, async (req, res) => {
    const { address } = req.body;
    if (!address) return res.status(400).json({ error: 'Adresse manquante' });

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, {
            method: 'GET',
            headers: { 'User-Agent': 'PreTpi-Navigation-App/1.0 (Projet_TPI_CPNV)' }
        });
        const data = await response.json();

        if (data && data.length > 0) {
            res.status(200).json({ lat: data[0].lat, lon: data[0].lon });
        } else {
            res.status(404).json({ error: 'Adresse introuvable' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du calcul' });
    }
});

// Suggestion de destination
router.post('/autocomplete', verifyToken, async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Texte manquant' });

    try {
        // limite à 5 résultats
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5`, {
            method: 'GET',
            headers: { 'User-Agent': 'PreTpi-Navigation-App/1.0 (Projet_TPI_CPNV)' }
        });
        const data = await response.json();

        const suggestions = data.map(place => place.display_name);
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;