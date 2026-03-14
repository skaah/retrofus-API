#!/bin/bash
# DofusBook Scraper Agent - À exécuter après expiration du rate limit
# Usage: ./dofusbook_scraper_agent.sh

WORKSPACE="/root/.openclaw/workspace"
OUTPUT_DIR="$WORKSPACE/dofusbook_scraped_data"

echo "🚀 DofusBook Retro Scraper Agent"
echo "================================"

# Vérifier si jina.ai est débloqué
echo "🔍 Test de l'accès à jina.ai..."
TEST_URL="https://r.jina.ai/http://retro.dofusbook.net/fr/encyclopedie/items"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TEST_URL")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ jina.ai est accessible! Lancement du scraping..."
    
    # Créer le répertoire de sortie
    mkdir -p "$OUTPUT_DIR"
    
    # Liste des pages à scraper
    for PAGE in {1..20}; do
        echo "📄 Scraping page $PAGE..."
        curl -s "https://r.jina.ai/http://retro.dofusbook.net/fr/encyclopedie/items?page=$PAGE" \
            -o "$OUTPUT_DIR/page_$PAGE.html"
        sleep 2
    done
    
    # Items spécifiques
    ITEMS=("gelano" "amulette-du-bouftou" "bottes-de-klim" "ceinture-du-mulou" 
           "kralano" "le-kumokan" "le-kim" "coiffe-de-bill-de-grobe"
           "sandales-circulaires-du-kimbo" "kralamansion")
    
    for ITEM in "${ITEMS[@]}"; do
        echo "🔍 Scraping item: $ITEM"
        curl -s "https://r.jina.ai/http://retro.dofusbook.net/fr/encyclopedie/items/$ITEM" \
            -o "$OUTPUT_DIR/item_$ITEM.html"
        sleep 1
    done
    
    echo "✅ Scraping terminé! Résultats dans: $OUTPUT_DIR"
    ls -la "$OUTPUT_DIR"
    
else
    echo "❌ jina.ai toujours bloqué (HTTP $HTTP_CODE)"
    echo "⏰ Réessayer plus tard..."
    exit 1
fi
