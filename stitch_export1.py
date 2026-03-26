#!/usr/bin/env python3
"""
stitch_export.py — Exporte un projet Stitch vers DESIGN.md + screenshots
Usage: python3 stitch_export.py
"""

import requests
import json
import os
import base64
from pathlib import Path

API_KEY = "AQ.Ab8RN6INpCq6U26YZ0n3NIbDFA3of1YCoiZVUXOyD9HlFYWssw"
PROJECT_ID = "13966394804484711469"
BASE_URL = "https://stitch.googleapis.com/mcp"
OUTPUT_DIR = Path("stitch_export")

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}",
}

def call_tool(tool_name, arguments):
    """Appelle un outil MCP Stitch"""
    payload = {
        "jsonrpc": "2.0",
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": arguments
        },
        "id": 1
    }
    r = requests.post(BASE_URL, headers=headers, json=payload)
    r.raise_for_status()
    result = r.json()
    if "error" in result:
        raise Exception(f"Erreur MCP: {result['error']}")
    return result["result"]

def list_tools():
    """Liste les outils disponibles"""
    payload = {"jsonrpc": "2.0", "method": "tools/list", "params": {}, "id": 1}
    r = requests.post(BASE_URL, headers=headers, json=payload)
    r.raise_for_status()
    return r.json()["result"]["tools"]

def main():
    OUTPUT_DIR.mkdir(exist_ok=True)

    # 1. Lister les outils disponibles
    print("🔍 Découverte des outils Stitch...")
    tools = list_tools()
    print(f"   {len(tools)} outils disponibles :")
    for t in tools:
        print(f"   - {t['name']}: {t.get('description','')[:60]}")

    # 2. Récupérer les screens du projet
    print(f"\n📋 Récupération des screens du projet {PROJECT_ID}...")
    screens_result = call_tool("list_screens", {"projectId": PROJECT_ID})
    print(json.dumps(screens_result, indent=2))

if __name__ == "__main__":
    main()
