#!/bin/bash
# Script pour mettre à jour le site retrofusV2 avec les dernières données

REPO_URL="https://github.com/skaah/retrofusV2.git"
LOCAL_DIR="/tmp/retrofusV2-update"

echo "🚀 Mise à jour du site retrofusV2"
echo "================================"

# Cloner le repo
rm -rf $LOCAL_DIR
git clone $REPO_URL $LOCAL_DIR

# Copier les nouvelles données
cp /root/.openclaw/workspace/dofus-retro-api/data/retrofusV2-format/*.json $LOCAL_DIR/data/

# Commit et push
cd $LOCAL_DIR
git add data/
git commit -m "🚀 MEGA UPDATE: 5,845 elements avec images DofusBook

API mise à jour depuis seed-data-merged-v2.2:
- Items: 4,538 (+4,371)
- Weapons: 882 (+748)
- Sets: 189 (+154)
- Monsters: 84
- Resources: 152

Toutes les entrées incluent les URLs d'images depuis DofusBook Retro"

git push origin main

echo "✅ Site mis à jour avec succès !"
echo "URL: https://skaah.github.io/retrofusV2/"
