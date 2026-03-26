#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# init-github.sh — Initialise le dépôt Git et pousse sur GitHub
#
# Prérequis :
#   sudo apt install git gh        # gh = GitHub CLI
#   gh auth login                  # S'authentifier une fois
#
# Usage :
#   cd /home/patrick/claude-workspace/meteor
#   bash packaging/init-github.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_NAME="atmosphere-weather"
DESCRIPTION="Tableau de bord météo Atmosphere — React + Vite + Electron"

echo "═══════════════════════════════════════════"
echo "  Atmosphere — Init GitHub"
echo "═══════════════════════════════════════════"

cd /home/patrick/claude-workspace/meteor

# Init git si besoin
if [ ! -d ".git" ]; then
  git init
  echo "▶ Dépôt Git initialisé"
fi

# Premier commit
git add -A
git commit -m "feat: initial commit — dashboard météo React (design Stitch)" 2>/dev/null || \
  git commit --allow-empty -m "chore: init" 2>/dev/null || true

# Créer le repo GitHub avec gh CLI
echo ""
echo "▶ Création du dépôt GitHub '$REPO_NAME'..."
gh repo create "$REPO_NAME" \
  --description "$DESCRIPTION" \
  --private \
  --source=. \
  --remote=origin \
  --push \
  2>/dev/null || {
    echo "  ℹ  Le dépôt existe peut-être déjà. Tentative de push..."
    git remote set-url origin "https://github.com/$(gh api user --jq .login)/$REPO_NAME.git" 2>/dev/null || true
    git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null || true
  }

echo ""
echo "═══════════════════════════════════════════"
echo "  ✓ Projet poussé sur GitHub"
echo "  → https://github.com/$(gh api user --jq .login 2>/dev/null || echo '<ton-login>')/$REPO_NAME"
echo "═══════════════════════════════════════════"
