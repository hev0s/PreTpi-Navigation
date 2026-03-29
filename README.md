# DuckyRoad (PreTpi-Navigation) 🦆🛣️

**DuckyRoad** est une application web full-stack de navigation et de signalement collaboratif en temps réel, inspirée d'applications comme Waze. Réalisé dans le cadre d'un projet de Pré-TPI (CPNV), ce projet agit comme un MVP (Minimum Viable Product) démontrant les concepts de cartographie, localisation, routage et interaction utilisateur en temps réel.

## 🌟 Fonctionnalités Principales

* 🗺️ **Cartographie et Routage** : Affichage interactif de la carte (Leaflet), recherche d'adresses avec autocomplétion, et calcul d'itinéraires complets incluant des étapes intermédiaires.
* 🧭 **Mode Navigation en Temps Réel** : 
    * Suivi GPS de l'utilisateur avec rotation automatique de la carte selon le cap.
    * Affichage en temps réel de la vitesse de l'utilisateur (km/h ou mph).
    * Récupération dynamique des limitations de vitesse (via Overpass API) avec alerte visuelle en cas d'excès.
    * Recalcul automatique de l'itinéraire si l'utilisateur quitte le trajet prévu.
    * Panneau ETA (Heure d'arrivée estimée, temps restant, distance).
* ⚠️ **Signalements Collaboratifs** : Signalement d'incidents sur la route (Accident, Bouchon, Travaux, Police, Brouillard, Danger). Les incidents proches sont regroupés (clustering) et l'application demande aux autres utilisateurs de valider si un incident est toujours présent.
* ⭐ **Gestion des Favoris** : Enregistrement, modification et suppression d'adresses favorites pour une recherche d'itinéraire rapide.
* 🔒 **Authentification et Sécurité** : Création de compte et connexion sécurisées via des mots de passe hachés (`bcrypt`) et des JSON Web Tokens (`JWT`).
* 🌍 **Multilingue (i18n)** : Support dynamique de plusieurs langues (Français, Anglais, Allemand).

## 🛠️ Technologies Utilisées

**Frontend :**
* HTML5, CSS3, JavaScript (Vanilla)
* [Leaflet.js](https://leafletjs.com/) (Cartographie)
* [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/) (Calcul d'itinéraires)

**Backend :**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
* [MySQL2](https://www.npmjs.com/package/mysql2) (Pool de connexions)
* [JSON Web Token (JWT)](https://jwt.io/) & [Bcrypt](https://www.npmjs.com/package/bcrypt) (Sécurité)

**APIs Tiers :**
* [OpenStreetMap / Nominatim](https://nominatim.org/) (Tuiles et Géocodage)
* [Photon Komoot API](https://photon.komoot.io/) (Autocomplétion des adresses)
* [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) (Détection des limitations de vitesse)

## 📁 Structure du Projet

```text
PreTpi-Navigation-develop/
├── app.js                          # Point d'entrée du serveur Node.js (Express)
├── package.json                    # Dépendances et scripts du projet
├── .env                            # Variables d'environnement (à créer)
├── Database/
│   ├── ConnectToDatabase.js        # Configuration et pool de connexion MySQL
│   └── LinkWithDatabase.js         # Requêtes SQL (Users, Favoris, Incidents)
├── routes/
│   ├── auth.js                     # Routes API pour l'authentification et les utilisateurs
│   └── navigation.js               # Routes API pour le géocodage, favoris et incidents
├── views/
│   ├── index.html                  # Page de connexion / inscription
│   ├── home.html                   # Application principale (Carte, Navigation)
│   └── settings.html               # Page des paramètres du compte
├── public/
│   └── js/
│       └── translations.js         # Système de traduction (FR, EN, DE)
└── Docs/                           # Cahier des charges, maquettes et images de l'application
