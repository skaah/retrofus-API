# 🔧 Guide Git Push - Résolution des erreurs d'authentification

## ❌ Le problème

GitHub a supprimé l'authentification par mot de passe en 2021. Tu dois utiliser :
- **Personal Access Token (PAT)** - Recommandé
- **SSH Key** - Alternative

---

## ✅ Solution 1: Personal Access Token (FACILE)

### Étape 1: Créer un token GitHub
1. Va sur https://github.com/settings/tokens
2. Clique **"Generate new token"** → **"Classic"**
3. Donne un nom: `Dofus Retro API`
4. Scopes: coche `repo` (accès complet aux repos)
5. Clique **"Generate token"**
6. **Copie le token** (il s'affiche une seule fois!)

### Étape 2: Push avec le token
```bash
cd /root/.openclaw/workspace/dofus-retro-api
git remote set-url origin https://TOKEN@github.com/skaah/retrofus-API.git
git push origin master
```

Remplace `TOKEN` par ton token copié.

---

## ✅ Solution 2: SSH (AVANCÉ)

### Étape 1: Générer une clé SSH
```bash
ssh-keygen -t ed25519 -C "ton-email@example.com"
# Appuie Enter 3 fois (pas de passphrase)
```

### Étape 2: Ajouter la clé à GitHub
1. Affiche la clé publique:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. Copie le contenu
3. Va sur https://github.com/settings/keys
4. Clique **"New SSH key"**
5. Colle la clé → **"Add SSH key"**

### Étape 3: Configurer le remote SSH
```bash
cd /root/.openclaw/workspace/dofus-retro-api
git remote set-url origin git@github.com:skaah/retrofus-API.git
git push origin master
```

---

## ✅ Solution 3: Utiliser GitHub CLI (FACILE)

```bash
# Installer gh CLI
apt install gh

# Authentifier
gh auth login
# Choisis: HTTPS → Y → copie le code → appuie Enter
# Va sur https://github.com/login/device et colle le code

# Push
gh repo clone skaah/retrofus-API
cd retrofus-API
git push origin master
```

---

## 🔍 Vérifier avant de push

```bash
cd /root/.openclaw/workspace/dofus-retro-api

# Vérifier le remote
git remote -v

# Doit afficher:
# origin  https://github.com/skaah/retrofus-API.git (fetch)
# origin  https://github.com/skaah/retrofus-API.git (push)

# Vérifier les commits en attente
git log --oneline -3
```

---

## 🚀 Méthode rapide (si tu as déjà un token)

```bash
# Dans le terminal OpenClaw, exécute:
export GITHUB_TOKEN="ton_token_ici"
cd /root/.openclaw/workspace/dofus-retro-api
git remote set-url origin https://${GITHUB_TOKEN}@github.com/skaah/retrofus-API.git
git push origin master
```

---

## 📊 Résumé du commit en attente

```
Commit: 9531338 🚀 Initial release: Dofus Retro API v1.0.0
Files: 24 fichiers, 7120+ lignes
Branch: master
Ready to push: ✅
```

**Quelle méthode tu préfères ?** Je peux te guider étape par étape.
