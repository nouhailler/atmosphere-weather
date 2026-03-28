# CLAUDE.md — Meteor Weather

## Contexte projet

Application météo desktop React/Vite nommée **Meteor**.
Répertoire racine : `/home/patrick/claude-workspace/meteor/`

**Avant toute session**, lis ce fichier intégralement puis consulte l'état courant :
```bash
cd /home/patrick/claude-workspace/meteor
git log --oneline -5
git status
```

---

## Tâche prioritaire au démarrage de cette session

```bash
cd /home/patrick/claude-workspace/meteor

# 1. Corriger le remote git vers le nouveau repo GitHub
git remote set-url origin https://github.com/nouhailler/meteor.git 2>/dev/null || \
  git remote add origin https://github.com/nouhailler/meteor.git

# 2. Vérifier
git remote -v

# 3. Build + push + release GitHub v1.2.0 avec .deb
bash packaging/push-github.sh
```

Si `push-github.sh` échoue, lis l'erreur, corrige, et relance. Ne demande pas confirmation pour relancer.

---

## Architecture du projet

```
meteor/
├── app/                          # Application React/Vite
│   ├── index.html                # Point d'entrée (Leaflet CSS inclus)
│   ├── package.json              # meteor-weather v1.2.0
│   └── src/
│       ├── App.jsx               # Routeur + WeatherProvider + styles globaux
│       ├── WeatherContext.jsx    # État global : location, météo, prefs
│       ├── WeatherDashboard.jsx  # Page Tableau de bord (layout autonome)
│       ├── Layout.jsx            # Shell sidebar+header partagé + HelpPanel
│       ├── HelpPanel.jsx         # Doc contextuelle (bouton ?)
│       ├── DayDetailModal.jsx    # Modal détail journée (createPortal)
│       ├── SearchBar.jsx         # Nominatim + GPS
│       ├── LoadingState.jsx      # LoadingSpinner + ErrorState
│       ├── tokens.js             # Design system (couleurs, shared styles)
│       ├── hooks/
│       │   ├── useWeather.js         # Open-Meteo forecast + computeAlerts()
│       │   ├── useAirQuality.js      # Open-Meteo Air Quality
│       │   ├── useHistorical.js      # Open-Meteo Archive (7/30/90j)
│       │   ├── useGeoSearch.js       # Nominatim + navigator.geolocation
│       │   ├── useNearbyWeather.js   # Grille 5×5 points autour de la ville
│       │   └── useCityImage.js       # Wikipedia → image ville, fallback drapeau
│       └── pages/
│           ├── CartesPage.jsx        # Leaflet + overlays météo temps réel
│           ├── AirPage.jsx           # Jauge IQA + polluants + historique 24h
│           ├── HistoriquePage.jsx    # 24h/7j/30j/90j + Chart.js + export CSV
│           └── ParamètresPage.jsx    # Préférences + À propos + Sources
├── packaging/
│   ├── build-deb.sh              # Build Electron → .deb (APP_NAME=meteor-weather)
│   └── push-github.sh            # Remote fix + git commit + push + gh release
├── electron-wrapper/             # Généré par build-deb.sh (ne pas éditer à la main)
├── release/                      # .deb généré ici
└── README.md                     # Documentation complète v1.2.0
```

---

## Commandes essentielles

### Développement
```bash
cd /home/patrick/claude-workspace/meteor/app
npm run dev          # → http://localhost:5173 (hot-reload)
npm run build        # Build de production → dist/
```

### Build et déploiement
```bash
cd /home/patrick/claude-workspace/meteor
bash packaging/build-deb.sh       # Build .deb uniquement
bash packaging/push-github.sh     # Build + push + release GitHub (tout-en-un)
```

### Git
```bash
cd /home/patrick/claude-workspace/meteor
git add -A && git commit -m "..."
git push origin main
```

---

## Dépendances npm (app/package.json)

```json
{
  "name": "meteor-weather",
  "version": "1.2.0",
  "dependencies": {
    "chart.js": "^4.4.3",
    "leaflet": "^1.9.4",
    "react": "^18.3.1",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.3.1",
    "react-leaflet": "^4.2.1"
  }
}
```

---

## Design system — règles impératives

### Couleurs (tokens.js)
- `t.primary` = `#5bb1ff` (bleu principal)
- `t.background` = `#060e20` (fond sombre)
- `t.glass` = `rgba(20,36,73,0.45)` (cartes glassmorphism)
- Toujours importer depuis `../tokens.js` (pages/) ou `./tokens.js` (src/)

### Composants
- Icônes : `<Icon name="..." size={N} filled={bool}/>` depuis `Layout.jsx`
- Sidebar : toujours via `Layout.jsx` (pages secondaires) ou inline dans `WeatherDashboard.jsx`
- Logo sidebar : `"Meteor"` — ne jamais remettre "Atmosphere"
- Version footer : `"Meteor v1.2.0 · Open-Meteo · OSM"`
- **Pas de bannière "Passer à Pro"** — l'application est open source
- **Pas de pastille utilisateur "PF"** — pas de notion de compte

### Chart.js — règle critique
Le conteneur du `<Line>` ou `<Bar>` **doit avoir une hauteur fixe en px**, jamais `height:"100%"` :
```jsx
// ✅ Correct
<div style={{ height: 220 }}>
  <Line data={...} options={{ maintainAspectRatio: false, ... }}/>
</div>

// ❌ Interdit — expansion infinie
<div style={{ height:"100%", minHeight:220 }}>
```

### Leaflet — règles
- `ZoomControls` doit être **à l'intérieur** du `<MapContainer>` pour accéder à `useMap()`
- `<TileLayer key={activeBase} .../>` — la `key` est obligatoire pour forcer le remount au changement de fond
- Le CSS Leaflet est chargé dans `index.html` via CDN unpkg

### Modal / Portal
- `DayDetailModal` est rendu via `createPortal(modal, document.body)` pour éviter tout blocage de scroll
- Fermeture : touche Échap + clic sur overlay

---

## Sources de données (toutes gratuites, sans clé API)

| Usage | URL |
|-------|-----|
| Météo forecast | `https://api.open-meteo.com/v1/forecast` |
| Qualité de l'air | `https://air-quality-api.open-meteo.com/v1/air-quality` |
| Historique | `https://archive-api.open-meteo.com/v1/archive` |
| Géocodage | `https://nominatim.openstreetmap.org` |
| Images villes | `https://fr.wikipedia.org/w/api.php` + `https://en.wikipedia.org/w/api.php` |
| Drapeaux | `https://flagcdn.com/w320/{iso}.png` |
| Cartes | OSM / CARTO / Esri (via Leaflet TileLayer) |

---

## GitHub

- **Repo** : `https://github.com/nouhailler/meteor`
- **Remote local** : `git remote set-url origin https://github.com/nouhailler/meteor.git`
- **Version actuelle** : `v1.2.0`
- **Prochain tag** : incrémenter selon semver (`v1.2.1` pour bugfix, `v1.3.0` pour feature)

### Workflow release
1. `bash packaging/push-github.sh` fait tout automatiquement :
   - Build Vite → dist/
   - Wrapper Electron → electron-wrapper/
   - Build .deb → release/meteor-weather_X.X.X_amd64.deb
   - git add -A → commit → push origin main
   - gh release create vX.X.X avec le .deb attaché

### Champs requis par electron-builder (déjà dans build-deb.sh)
Le `package.json` du wrapper Electron doit absolument contenir :
- `"homepage"` — sinon erreur electron-builder
- `"author": { "name": "...", "email": "..." }` — format objet obligatoire
- `"maintainer"` dans la section `linux` — obligatoire pour .deb

---

## Comportements connus et solutions

| Problème | Cause | Solution |
|----------|-------|----------|
| Graphique Chart.js s'étend à l'infini | `height:"100%"` sur le wrapper | Mettre `height: 220` (px fixe) |
| TileLayer ne change pas au clic | Pas de `key` sur `<TileLayer>` | Ajouter `key={activeBase}` |
| Boutons zoom Leaflet inopérants | `useMap()` hors contexte Leaflet | Mettre `ZoomControls` dans `<MapContainer>` |
| Modal bloque le scroll | Rendu dans le DOM parent | Utiliser `createPortal(modal, document.body)` |
| electron-builder refuse de builder | `homepage`/`email`/`maintainer` manquants | Voir section GitHub ci-dessus |
| Remote git pointe vers `atmosphere-weather` | Ancien nom du repo | `git remote set-url origin https://github.com/nouhailler/meteor.git` |

---

## Règles de travail pour Claude Code

1. **Lire ce fichier en entier** avant de commencer
2. **Exécuter la tâche prioritaire** en haut de ce fichier si elle n'est pas déjà faite (`git remote -v` pour vérifier)
3. Toujours vérifier `npm run build` après une modification de code avant de committer
4. En cas d'erreur de build, lire la sortie complète, corriger, et relancer — ne pas demander confirmation
5. Ne jamais modifier `electron-wrapper/` à la main — ce dossier est regénéré par `build-deb.sh`
6. Ne jamais ajouter de bannière "Pro" ni de notion de compte utilisateur
7. Committer avec un message clair au format `feat:`, `fix:`, `docs:`, `chore:`
8. Après chaque release, incrémenter la version dans : `app/package.json`, `Layout.jsx` (footer), `WeatherDashboard.jsx` (footer), `build-deb.sh` (APP_VERSION), `README.md` (badge)
