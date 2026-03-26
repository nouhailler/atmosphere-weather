#!/usr/bin/env python3
"""
stitch_export.py — Exporte un projet Stitch vers DESIGN.md + HTML + screenshots
"""

import requests
import json
from pathlib import Path

API_KEY = "AQ.Ab8RN6INpCq6U26YZ0n3NIbDFA3of1YCoiZVUXOyD9HlFYWssw"
PROJECT_ID = "13966394804484711469"
BASE_URL = "https://stitch.googleapis.com/mcp"
OUTPUT_DIR = Path("stitch_export")

headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY,
}

def call_mcp(method, params):
    payload = {"jsonrpc": "2.0", "method": method, "params": params, "id": 1}
    r = requests.post(BASE_URL, headers=headers, json=payload)
    r.raise_for_status()
    result = r.json()
    # Extraire les données structurées
    content = result["result"]
    if "structuredContent" in content:
        return content["structuredContent"]
    # Fallback : parser le texte JSON
    text = content["content"][0]["text"]
    return json.loads(text)

def download_file(url, path):
    """Télécharge un fichier depuis une URL Google"""
    r = requests.get(url, headers={"Authorization": f"Bearer {API_KEY}"})
    if r.status_code != 200:
        # Essai sans auth pour les screenshots lh3.googleusercontent.com
        r = requests.get(url)
    if r.status_code == 200:
        path.write_bytes(r.content)
        return True
    return False

def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    (OUTPUT_DIR / "html").mkdir(exist_ok=True)
    (OUTPUT_DIR / "screenshots").mkdir(exist_ok=True)

    print("📋 Récupération des screens...")
    data = call_mcp("tools/call", {
        "name": "list_screens",
        "arguments": {"projectId": PROJECT_ID}
    })
    screens = data["screens"]
    print(f"   {len(screens)} screens trouvés")

    design_md = [f"# DESIGN.md — Projet Stitch {PROJECT_ID}\n"]
    design_md.append(f"Exporté automatiquement depuis Google Stitch\n")
    design_md.append("---\n")

    for i, screen in enumerate(screens):
        title = screen.get("title", f"Screen {i+1}")
        screen_id = screen["name"].split("/")[-1]
        device = screen.get("deviceType", "UNKNOWN")
        width = screen.get("width", "?")
        height = screen.get("height", "?")

        print(f"\n[{i+1}/{len(screens)}] {title} ({device} {width}x{height})")

        # Slug pour les noms de fichiers
        slug = title.lower().replace(" ", "_").replace("'", "").replace("(", "").replace(")", "")

        design_md.append(f"## {title}")
        design_md.append(f"- **ID** : `{screen_id}`")
        design_md.append(f"- **Device** : {device} — {width}x{height}px")

        # Télécharger le HTML
        html_url = screen.get("htmlCode", {}).get("downloadUrl")
        if html_url:
            html_path = OUTPUT_DIR / "html" / f"{slug}.html"
            if download_file(html_url, html_path):
                print(f"   ✓ HTML : {html_path}")
                design_md.append(f"- **HTML** : `html/{slug}.html`")

        # Télécharger le screenshot
        screenshot_url = screen.get("screenshot", {}).get("downloadUrl")
        if screenshot_url:
            img_path = OUTPUT_DIR / "screenshots" / f"{slug}.png"
            if download_file(screenshot_url, img_path):
                print(f"   ✓ Screenshot : {img_path}")
                design_md.append(f"- **Screenshot** : `screenshots/{slug}.png`")
                design_md.append(f"  ![{title}](screenshots/{slug}.png)")
        else:
            print(f"   — Pas de screenshot disponible")

        design_md.append("")

    # Écrire le DESIGN.md
    design_path = OUTPUT_DIR / "DESIGN.md"
    design_path.write_text("\n".join(design_md), encoding="utf-8")
    print(f"\n✅ DESIGN.md généré : {design_path}")
    print(f"✅ Export complet dans : {OUTPUT_DIR}/")

if __name__ == "__main__":
    main()
