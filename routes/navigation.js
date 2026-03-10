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

// --- GÉOCODAGE ---
router.post('/geocode', verifyToken, async (req, res) => {
    const { address, lat, lon } = req.body;

    if (!address) return res.status(400).json({ error: 'Adresse manquante' });

    try {
        // Suggestion avec Nominatim
        const nomResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`, {
            method: 'GET',
            headers: { 'User-Agent': 'PreTpi-Navigation-App/1.0 (Projet_TPI_CPNV)' }
        });

        if (nomResponse.ok) {
            const nomData = await nomResponse.json();
            if (nomData && nomData.length > 0) {
                return res.status(200).json({ lat: nomData[0].lat, lon: nomData[0].lon });
            }
        }

        // Suggestion avec Photon
        let photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`;
        if (lat && lon) {
            photonUrl += `&lat=${lat}&lon=${lon}`;
        }

        const photonResponse = await fetch(photonUrl);

        if (photonResponse.ok) {
            const photonData = await photonResponse.json();
            if (photonData.features && photonData.features.length > 0) {
                const coords = photonData.features[0].geometry.coordinates;
                return res.status(200).json({ lat: coords[1], lon: coords[0] });
            }
        }

        res.status(404).json({ error: 'Adresse introuvable' });

    } catch (error) {
        console.error("Erreur de géocodage:", error);
        res.status(500).json({ error: 'Erreur lors du calcul' });
    }
});

router.post('/autocomplete', verifyToken, async (req, res) => {
    const { text, lat, lon } = req.body;
    if (!text) return res.status(400).json({ error: 'Texte manquant' });

    try {
        let apiUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=5`;

        if (lat && lon) {
            apiUrl += `&lat=${lat}&lon=${lon}`;
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

            if (p.country && !parts.includes(p.country)) parts.push(p.country);

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