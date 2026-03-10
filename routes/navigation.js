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

// Post avec Photon
router.post('/geocode', verifyToken, async (req, res) => {
    const { address, lat, lon } = req.body;

    if (!address) return res.status(400).json({ error: 'Adresse manquante' });

    try {
        let apiUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`;

        if (lat && lon) {
            apiUrl += `&lat=${lat}&lon=${lon}`;
        } else {
            apiUrl += `&lat=46.8&lon=6.5`;
        }

        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const data = await response.json();

        // Photon renvoie les données au format GeoJSON
        if (data.features && data.features.length > 0) {
            //Gestion de GeoJSON
            const coords = data.features[0].geometry.coordinates;
            res.status(200).json({ lat: coords[1], lon: coords[0] });
        } else {
            res.status(404).json({ error: 'Adresse introuvable' });
        }
    } catch (error) {
        console.error("Erreur de géocodage:", error);
        res.status(500).json({ error: 'Erreur lors du calcul' });
    }
});

// API Photon avec priorité GPS (suggestion)
router.post('/autocomplete', verifyToken, async (req, res) => {
    const { text, lat, lon } = req.body;
    if (!text) return res.status(400).json({ error: 'Texte manquant' });

    try {
        let apiUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=5`;

        if (lat && lon) {
            apiUrl += `&lat=${lat}&lon=${lon}`;
        } else {
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