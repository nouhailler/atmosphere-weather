#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# build-deb.sh — Packaging Debian pour Meteor Weather (Electron + Vite/React)
#
# Usage :
#   cd /home/patrick/claude-workspace/meteor
#   bash packaging/build-deb.sh
#
# Résultat :
#   release/meteor-weather_1.2.0_amd64.deb
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
APP_DIR="$ROOT_DIR/app"
ELECTRON_DIR="$ROOT_DIR/electron-wrapper"
RELEASE_DIR="$ROOT_DIR/release"

APP_NAME="meteor-weather"
APP_VERSION="1.2.0"
GH_REPO="https://github.com/nouhailler/meteor"   # repo GitHub cible

echo "═══════════════════════════════════════════"
echo "  Meteor Weather — Build .deb v${APP_VERSION}"
echo "═══════════════════════════════════════════"

# ── 1. Build Vite ─────────────────────────────────────────────────────────────
echo ""
echo "▶ [1/4] Build Vite (React)..."
cd "$APP_DIR"
npm install --silent
npm run build
echo "   ✓ dist/ généré"

# ── 2. Préparer le wrapper Electron ───────────────────────────────────────────
echo ""
echo "▶ [2/4] Préparation du wrapper Electron..."
mkdir -p "$ELECTRON_DIR"

rm -rf "$ELECTRON_DIR/dist"
cp -r "$APP_DIR/dist" "$ELECTRON_DIR/dist"

cat > "$ELECTRON_DIR/main.js" << 'ELECTRON_MAIN'
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    title: 'Meteor',
    backgroundColor: '#060e20',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })
  win.loadFile(path.join(__dirname, 'dist', 'index.html'))
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
ELECTRON_MAIN

echo "   ✓ main.js Electron créé"

# package.json avec tous les champs requis par electron-builder pour .deb
cat > "$ELECTRON_DIR/package.json" << ELECTRON_PKG
{
  "name": "${APP_NAME}",
  "version": "${APP_VERSION}",
  "description": "Meteor — Tableau de bord météo open source",
  "homepage": "${GH_REPO}",
  "main": "main.js",
  "author": {
    "name": "Patrick Favre",
    "email": "patrick@meteor-weather.local"
  },
  "license": "MIT",
  "scripts": {
    "start": "electron .",
    "dist": "electron-builder --linux deb"
  },
  "build": {
    "appId": "ch.meteor.weather",
    "productName": "Meteor",
    "directories": { "output": "../release" },
    "linux": {
      "target": "deb",
      "category": "Utility",
      "icon": "assets/icon.png",
      "synopsis": "Tableau de bord météo local",
      "description": "Meteor — Application météo open source. Données Open-Meteo, Leaflet, Chart.js. Sans compte, sans clé API.",
      "maintainer": "Patrick Favre <patrick@meteor-weather.local>"
    },
    "deb": {
      "depends": [
        "libgtk-3-0",
        "libnotify4",
        "libnss3",
        "libxss1",
        "libxtst6",
        "xdg-utils",
        "libatspi2.0-0",
        "libuuid1"
      ]
    }
  },
  "devDependencies": {
    "electron": "^31.0.0",
    "electron-builder": "^24.13.0"
  }
}
ELECTRON_PKG

echo "   ✓ package.json Electron créé"

# Icône par défaut si absente
mkdir -p "$ELECTRON_DIR/assets"
if [ ! -f "$ELECTRON_DIR/assets/icon.png" ]; then
  if command -v inkscape &>/dev/null; then
    cat > /tmp/meteor-icon.svg << 'SVG_ICON'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#060e20"/>
  <circle cx="256" cy="220" r="90" fill="none" stroke="#5bb1ff" stroke-width="20"/>
  <path d="M140 320 Q256 360 372 320" stroke="#5bb1ff" stroke-width="18" fill="none" stroke-linecap="round"/>
  <path d="M110 370 Q256 420 402 370" stroke="#44a3f5" stroke-width="14" fill="none" stroke-linecap="round"/>
</svg>
SVG_ICON
    inkscape /tmp/meteor-icon.svg --export-png="$ELECTRON_DIR/assets/icon.png" --export-width=512 2>/dev/null || true
  fi
  [ ! -f "$ELECTRON_DIR/assets/icon.png" ] && \
    echo "   ⚠  Icône manquante — electron-builder utilisera l'icône par défaut"
fi

# ── 3. Installer les dépendances Electron ─────────────────────────────────────
echo ""
echo "▶ [3/4] Installation des dépendances Electron..."
cd "$ELECTRON_DIR"
npm install --silent
echo "   ✓ electron + electron-builder installés"

# ── 4. Build .deb ─────────────────────────────────────────────────────────────
echo ""
echo "▶ [4/4] Build du paquet .deb..."
mkdir -p "$RELEASE_DIR"
npm run dist -- --publish=never

echo ""
echo "═══════════════════════════════════════════"
echo "  ✓ Paquet .deb généré dans : release/"
ls -lh "$RELEASE_DIR"/*.deb 2>/dev/null || echo "  (vérifier le dossier release/)"
echo "═══════════════════════════════════════════"
echo ""
echo "  Pour installer :"
echo "  sudo dpkg -i release/${APP_NAME}_${APP_VERSION}_amd64.deb"
echo ""
