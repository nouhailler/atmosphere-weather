# Atmosphere — Tableau de bord Météo

Application météo desktop construite avec Vite + React, basée sur les designs exportés depuis Google Stitch.

## Démarrage rapide

```bash
cd app
npm install
npm run dev
```

L'application s'ouvre automatiquement sur http://localhost:5173

## Commandes

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement avec hot-reload |
| `npm run build` | Build de production dans `app/dist/` |
| `npm run preview` | Prévisualiser le build de production |

## Structure

```
meteor/
├── app/                    # Application React (Vite)
│   ├── src/
│   │   ├── main.jsx        # Point d'entrée React
│   │   └── WeatherDashboard.jsx  # Composant principal
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── stitch_export/          # Export Google Stitch (référence)
│   ├── html/               # Fichiers HTML des screens
│   ├── screenshots/        # Captures d'écran
│   └── DESIGN.md           # Index du design system
├── stitch_export.py        # Script d'export Stitch
└── packaging/              # Scripts de packaging Debian
    └── build-deb.sh
```

## Design system

- **Typographie** : Manrope (titres) + Inter (corps)
- **Icônes** : Material Symbols Outlined (Google Fonts)
- **Thème** : Dark mode — palette Material Design bleue/nuit
- **Glassmorphism** : `backdrop-filter: blur` sur les cards

## Packaging Debian

Voir [`packaging/build-deb.sh`](packaging/build-deb.sh) — nécessite `electron` et `electron-builder`.

## Licence

MIT
