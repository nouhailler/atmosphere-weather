# 🌤️ Atmosphere — Tableau de bord météo

[![Version](https://img.shields.io/badge/version-1.1.0-blue)](https://github.com/nouhailler/atmosphere-weather/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Application météo desktop construite avec **Vite + React**, design exporté depuis Google Stitch, données réelles via **Open-Meteo** (gratuit, sans clé API).

![Dashboard](stitch_export/screenshots/tableau_de_bord_météo_nav.png)

---

## ✨ Nouveautés (v1.1.0)

- **Alertes météo** — notifications visuelles pour conditions extrêmes  
- **Graphiques horaires** — visualisation interactive des températures et précipitations  
- **Images des villes** — affichage d'une photo de la ville sélectionnée  
- **Météo à proximité** — stations météo autour de votre position  
- **Paquet Debian (.deb)** — installation système simple sur Linux

---

## 🚀 Démarrage rapide

### Depuis les sources

```bash
cd app
npm install
npm run dev
# → http://localhost:5173
Depuis le paquet Debian (.deb)
bash
# Téléchargez le fichier .deb depuis la release
sudo dpkg -i atmosphere-weather_1.1.0_all.deb
sudo apt install -f
# Lancez l'application
atmosphere-weather
L'application démarre un serveur local sur le port 8080 et ouvre automatiquement votre navigateur.

📦 Fonctionnalités
Catégorie	Détails
Données météo	Températures, vent, UV, humidité, pression via Open-Meteo
Qualité de l'air	PM2.5, PM10, NO2, O3, SO2, CO via Open-Meteo Air Quality API
Historique	Jusqu'à 90 jours via Open-Meteo Archive API + export CSV
Recherche villes	Autocomplétion via Nominatim (OpenStreetMap)
Géolocalisation	Bouton "Ma position" avec reverse geocoding
Préférences	Unité °C/°F, ville favorite, sauvegardées dans localStorage
Alertes météo	Affichage de bannières pour conditions dangereuses
Graphiques horaires	Visualisation des températures sur 24h avec Chart.js
Images de villes	Photos dynamiques via API (optionnel)
Météo à proximité	Liste des stations météo autour de votre position
Écrans disponibles
Tableau de bord — résumé quotidien

Cartes — visualisation cartographique avec Leaflet

Qualité de l'air — indices et polluants

Historique — graphiques sur plusieurs jours + export CSV

Paramètres — préférences utilisateur

🛠️ Stack technique
Couche	Technologie
Framework	React 18 + Vite 5
État global	React Context
Données météo	Open-Meteo API
Géocodage	Nominatim / OpenStreetMap
Design	Google Stitch (export)
Icônes	Material Symbols Outlined
Typographie	Manrope + Inter
Graphiques	Chart.js
Cartes	Leaflet / React-Leaflet
Packaging	Paquet Debian (.deb)
📁 Architecture du projet
text
atmosphere-weather/
├── app/                         # Code source React
│   ├── src/
│   │   ├── App.jsx              # Routeur + WeatherProvider
│   │   ├── WeatherContext.jsx
│   │   ├── Layout.jsx
│   │   ├── SearchBar.jsx
│   │   ├── AlertsBanner.jsx
│   │   ├── DayDetailModal.jsx
│   │   ├── HourlyChart.jsx
│   │   ├── hooks/
│   │   │   ├── useWeather.js
│   │   │   ├── useAirQuality.js
│   │   │   ├── useGeoSearch.js
│   │   │   ├── useHistorical.js
│   │   │   ├── useCityImage.js
│   │   │   └── useNearbyWeather.js
│   │   └── pages/
│   │       ├── DashboardPage.jsx
│   │       ├── CartesPage.jsx
│   │       ├── AirPage.jsx
│   │       ├── HistoriquePage.jsx
│   │       └── ParamètresPage.jsx
│   ├── public/
│   └── package.json
├── packaging/                   # Scripts Debian
│   ├── build-deb.sh
│   └── push-github.sh
└── README.md
🧪 Commandes de développement
bash
npm run dev      # Serveur de développement (hot-reload)
npm run build    # Build de production → app/dist/
npm run preview  # Prévisualiser le build
📦 Créer le paquet Debian
bash
cd ~/claude-workspace/meteor
bash packaging/build-deb.sh
sudo dpkg -i atmosphere-weather_1.1.0_all.deb
🌐 Sources de données
Météo & prévisions : Open-Meteo — gratuit, sans clé, RGPD-compliant

Qualité de l'air : Open-Meteo Air Quality

Historique : Open-Meteo Archive

Géocodage : Nominatim / OpenStreetMap

🤝 Contribution
Les contributions sont les bienvenues !

Forkez le projet

Créez une branche (git checkout -b feature/amazing-feature)

Commitez vos changements (git commit -m 'Add some amazing feature')

Poussez (git push origin feature/amazing-feature)

Ouvrez une Pull Request

📄 Licence
Distribué sous licence MIT. Voir LICENSE pour plus d'informations.

Projet maintenu par Patrick Favre
N'hésitez pas à ouvrir une issue pour signaler un bug ou proposer une amélioration !
