#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# push-github.sh — Build .deb, push GitHub, crée release v1.2.0 avec le .deb
#
# Prérequis :
#   sudo apt install git gh
#   gh auth login   (une seule fois)
#
# Usage :
#   cd /home/patrick/claude-workspace/meteor
#   bash packaging/push-github.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

APP_NAME="meteor"
APP_NAME_DEB="meteor-weather"   # nom du .deb (avec tiret, convention debian)
APP_VERSION="1.2.0"
TAG="v${APP_VERSION}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "═══════════════════════════════════════════"
echo "  Meteor Weather — Push GitHub + Release"
echo "═══════════════════════════════════════════"

# ── 0. Vérifier gh CLI ────────────────────────────────────────────────────────
GH_USER=$(gh api user --jq .login 2>/dev/null || echo "")
if [ -z "$GH_USER" ]; then
  echo "✗ GitHub CLI non authentifié. Exécute : gh auth login"
  exit 1
fi
echo "▶ Connecté en tant que : $GH_USER"

REPO_URL="https://github.com/${GH_USER}/${APP_NAME}.git"
RELEASE_DIR="$ROOT/release"

# ── 1. Build .deb ─────────────────────────────────────────────────────────────
echo ""
echo "▶ [1/5] Build du paquet .deb..."
bash "$ROOT/packaging/build-deb.sh"

DEB_FILE=$(ls "$RELEASE_DIR"/${APP_NAME_DEB}_*.deb 2>/dev/null | head -1 || echo "")
if [ -z "$DEB_FILE" ]; then
  echo "✗ Aucun .deb trouvé dans release/ — le build a peut-être échoué."
  exit 1
fi
echo "   ✓ .deb : $DEB_FILE"

# ── 2. Init / configurer git ──────────────────────────────────────────────────
echo ""
echo "▶ [2/5] Préparation du dépôt git..."

if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

git config user.email "patrick@meteor.local" 2>/dev/null || true
git config user.name  "Patrick Favre"         2>/dev/null || true

# Créer le repo GitHub 'meteor' si inexistant
if ! gh repo view "${GH_USER}/${APP_NAME}" > /dev/null 2>&1; then
  echo "▶ Création du repo GitHub '${APP_NAME}'..."
  gh repo create "$APP_NAME" \
    --description "☄️ Meteor — Tableau de bord météo open source (React + Open-Meteo)" \
    --public 2>/dev/null || true
fi

# Corriger le remote si il pointe encore vers atmosphere-weather ou meteor-weather
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$CURRENT_REMOTE" ]; then
  git remote add origin "$REPO_URL"
  echo "   ✓ Remote origin ajouté : $REPO_URL"
elif [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
  echo "   ⚠  Remote actuel : $CURRENT_REMOTE"
  echo "   ↳  Mise à jour vers : $REPO_URL"
  git remote set-url origin "$REPO_URL"
  echo "   ✓ Remote corrigé"
else
  echo "   ✓ Remote origin OK : $REPO_URL"
fi

# ── 3. Commit + push ──────────────────────────────────────────────────────────
echo ""
echo "▶ [3/5] Commit et push..."

git add -A

if git diff --cached --quiet; then
  echo "   ℹ  Rien de nouveau à committer."
else
  git commit -m "feat: Meteor v${APP_VERSION}

Renommage Atmosphere → Meteor + nouvelles fonctionnalités majeures :

Tableau de bord
- Image de ville via Wikimedia Commons (fallback drapeau pays)
- Alertes météo contextuelles et dismissables
- Graphique température 24h avec Chart.js (hauteur fixe, sans expansion infinie)
- Prévisions 7 jours avec lever/coucher soleil + prob. pluie
- Modal détail journée (createPortal, fermeture Échap)
- Metrics Humidité et Vent centrées avec grande police

Carte interactive
- Vraie carte Leaflet (OpenStreetMap / CARTO / Satellite / Topo)
- Zoom +/− fonctionnel (ZoomControls dans MapContainer)
- Overlays météo réels : grille 5×5 Open-Meteo (précipitations, température, vent, nuages)
- Légende contextuelle adaptée au calque actif
- Fond Standard + Overlay Précipitations par défaut

Qualité de l'air
- Vue En Direct : jauge IQA + 6 polluants + recommandations
- Historique 24h : graphique barres Chart.js coloré + tableau heure/heure

Historique
- Mode 24h fonctionnel (données horaires du contexte)
- Export CSV nommé avec ville et période

Aide contextuelle
- Bouton ? dans chaque fenêtre (remplace pastille utilisateur)
- Panneau HelpPanel slide-in avec doc adaptée à chaque page

Autres
- Scrollbar élargie à 8px (cliquable avec la souris)
- Bannière Pro supprimée partout
- Section Compte supprimée des Paramètres
- README complet mis à jour
- Repo renommé atmosphere-weather → meteor"
  echo "   ✓ Commit effectué"
fi

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
[ "$CURRENT_BRANCH" != "main" ] && git branch -M main

git push -u origin main --force 2>/dev/null || git push -u origin main
echo "   ✓ Push effectué"

# ── 4. Créer/mettre à jour le tag ─────────────────────────────────────────────
echo ""
echo "▶ [4/5] Tag $TAG..."

gh release delete "$TAG" --yes 2>/dev/null || true
git tag -d "$TAG" 2>/dev/null || true
git push origin --delete "$TAG" 2>/dev/null || true

git tag "$TAG"
git push origin "$TAG"
echo "   ✓ Tag $TAG créé"

# ── 5. Créer la release GitHub avec le .deb ───────────────────────────────────
echo ""
echo "▶ [5/5] Création de la release GitHub..."

gh release create "$TAG" "$DEB_FILE" \
  --title "Meteor ${TAG}" \
  --notes "## ☄️ Meteor ${TAG}

### Nouveautés majeures

**Tableau de bord**
- Image de la ville via Wikimedia Commons, fallback automatique sur le drapeau du pays
- Alertes météo contextuelles (vent, UV, pluie, gel) dismissables individuellement
- Courbe de température 24h corrigée (hauteur fixe, graphique stable)
- Prévisions 7 jours avec lever/coucher du soleil et probabilité de pluie
- Modal détail journée amélioré (portal React, fermeture Échap)

**Carte interactive**
- Zoom +/− et géolocalisation fonctionnels
- Overlays météo en temps réel : grille 25 points Open-Meteo
- 4 fonds de carte, 4 overlays (précipitations, température, vent, nuages)
- Légende contextuelle par calque

**Qualité de l'air**
- Historique 24h fonctionnel : graphique Chart.js + tableau heure/heure

**Historique**
- Bouton 24h fonctionnel (données horaires du contexte)

**Documentation intégrée**
- Bouton ? dans chaque fenêtre (remplace la pastille utilisateur)
- Panneau d'aide contextuel adapté à chaque page

### Installation

\`\`\`bash
sudo dpkg -i meteor-weather_${APP_VERSION}_amd64.deb
sudo apt install -f
meteor-weather
\`\`\`

### Sources de données
Toutes gratuites, sans clé API : Open-Meteo · Nominatim/OSM · Wikimedia Commons · flagcdn.com"

echo ""
echo "═══════════════════════════════════════════"
echo "  ✓ Release ${TAG} publiée avec le .deb !"
echo "  → https://github.com/${GH_USER}/${APP_NAME}/releases/tag/${TAG}"
echo "═══════════════════════════════════════════"
