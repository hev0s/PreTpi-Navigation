import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

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

router.post('/geocode', verifyToken, async (req, res) => {
    const { address } = req.body;

    if (!address) return res.status(400).json({ error: 'Adresse manquante' });

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, {
            method: 'GET',
            headers: { 'User-Agent': 'PreTpi-Navigation-App/1.0 (Projet_TPI_CPNV)' }
        });

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

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

// Priorisation position GPS
router.post('/autocomplete', verifyToken, async (req, res) => {
    const { text, lat, lon } = req.body;
    if (!text) return res.status(400).json({ error: 'Texte manquant' });

    try {
        let apiUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=5`;

        // utilisation de la position GPS si disponible
        if (lat && lon) {
            apiUrl += `&lat=${lat}&lon=${lon}`;
        } else {
            // Sinon, position par défaut (Centre de la Suisse Romande)
            apiUrl += `&lat=46.8&lon=6.5`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        const suggestions = data.features.map(f => {
            const p = f.properties;
            let parts = [];

            if (p.name && p.name !== p.housenumber) parts.push(p.name);

            if (p.street) {
                let streetStr = p.street;
                if (p.housenumber) streetStr += " " + p.housenumber;
                if (!parts.includes(p.street) && !parts.includes(streetStr)) parts.push(streetStr);
            }

            let city = p.city || p.town || p.village;
            if (city && !parts.includes(city)) parts.push(city);

            return parts.join(', ');
        });

        const uniqueSuggestions = [...new Set(suggestions.filter(s => s !== ''))];
        res.status(200).json(uniqueSuggestions);
    } catch (error) {
        console.error("Erreur Autocomplete:", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;