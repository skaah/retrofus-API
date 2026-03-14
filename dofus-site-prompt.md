# 🎮 PROMPT AGENT IE - Site Dofus Retro API

## 📋 CONTEXTE DU PROJET

Tu dois créer un site web **ultra-moderne** pour exposer une API Dofus Retro. L'API contient :
- **169 items** (équipements, consommables)
- **138 armes** avec leurs caractéristiques
- **155 ressources** de craft
- **84 monstres** avec butins et zones
- **35 panoplies** complètes
- **12 professions**

Deadline implicite : le site doit être **production-ready** et impressionner visuellement.

---

## 🎨 DIRECTION ARTISTIQUE

### Références visuelles (obligatoires à étudier)
1. **Dofus.com** - Navigation, typographie, univers coloré
2. **Raider.IO** - Organisation data-heavy élégante
3. **Wiki.gg / Fextralife** - Encyclopédie gaming moderne
4. **Diablo 4 Armory** - Présentation items premium
5. **New World Database** - Filtres et recherche avancée

### Palette de couleurs
- **Primaire** : `#FF6B35` (orange Dofus chaud)
- **Secondaire** : `#4ECDC4` (turquoise magique)
- **Accent** : `#FFE66D` (or/jaune succès)
- **Fond** : `#0D0D0D` → `#1A1A2E` (dégradé sombre premium)
- **Surface** : `#16213E` avec glassmorphism
- **Texte** : `#F7F7F7` (blanc cassé), `#A0A0A0` (gris secondaire)

### Typographie
- **Titres** : "Cinzel" ou "Exo 2" (style médiéval-fantasy moderne)
- **Corps** : "Inter" ou "Space Grotesk" (lisible, tech)
- **Monospace** : "JetBrains Mono" (pour les stats/chiffres)

---

## ⚡ ANIMATIONS & INTERACTIONS (Critique)

### Micro-interactions obligatoires
```
✓ Hover sur item card → zoom 1.05 + glow + levitation
✓ Hover sur bouton → ripple effect + scale
✓ Chargement → skeleton screens pulsants
✓ Navigation → transitions fluides (300ms ease-out)
✓ Scroll → parallaxe subtile sur les backgrounds
✓ Filtres → animation de réorganisation (layout shift smooth)
✓ Modal/Drawer → slide-in avec backdrop blur
```

### Animations spécifiques Dofus
- **Rareté des items** : aura pulsante selon la rareté (comme dans le jeu)
- **Stats** : compteur animé à l'apparition
- **Drag & drop** : effet magnétique pour le simulateur de panoplie
- **Recherche** : autocomplete avec preview instantanée

### Tech animation
- **Framer Motion** (React) ou **GSAP** pour les animations complexes
- **Intersection Observer** pour les reveal-on-scroll
- **will-change** optimisé sur les éléments animés

---

## 🏗️ ARCHITECTURE & FEATURES

### Pages obligatoires

#### 1. **Homepage / Dashboard**
- Hero section avec search bar centrale (style Google mais fantasy)
- Quick access cards : "Explorer les items", "Bestiaire", "Calculateur de panoplie"
- Stats live : "169 items référencés", "84 monstres catalogués"
- Derniers ajouts à l'API (news feed)

#### 2. **Encyclopédie des Items** (cœur du site)
```
Layout :
├── Sidebar fixe (filtres avancés)
│   ├── Type d'item (checkboxes)
│   ├── Niveau requis (range slider)
│   ├── Caractéristiques (tags cliquables)
│   ├── Rareté (chips)
│   └── Réinitialiser filtres
│
├── Grille responsive
│   ├── Card item (design premium)
│   │   ├── Image item (lazy load)
│   │   ├── Nom + niveau
│   │   ├── Stats principales (icones)
│   │   ├── Conditions (mini tags)
│   │   └── Prix estimé (si dispo)
│   └── Infinite scroll
│
└── Detail Panel (slide-in)
    ├── Grand visuel de l'item
    ├── Toutes les stats
    ├── Recette de craft (si applicable)
    ├── Monstres qui drop
    └── "Ajouter à ma panoplie"
```

#### 3. **Bestiaire**
- Carte interactive des zones (Astrub, Bonta, Brâkmar...)
- Liste monstres avec :
  - Avatar
  - Niveau + PV + PA/PM
  - Butins (hover pour détails)
  - Zones de spawn
- Filtrage par niveau / zone / type

#### 4. **Simulateur de Panoplie** (feature star)
- Interface drag & drop
- Slots d'équipement visuels (comme dans le jeu)
- Calcul automatique des bonus cumulés
- Suggestion d'optimisation
- Sauvegarde de builds (localStorage)

#### 5. **Calculateur de Craft**
- Saisie de l'objet cible
- Arbre de craft complet (visualisation arborescente)
- Calcul du prix total des ressources
- Liste de courses exportable

### Composants UI réutilisables à créer
```
├── <ItemCard />      - Carte item avec hover effects
├── <ItemDetail />    - Panel détaillé slide-in
├── <MonsterCard />   - Carte monstre
├── <StatBadge />     - Badge stat avec couleur selon valeur
├── <FilterPill />    - Pilule de filtre active
├── <SearchBar />     - Search avec autocomplete
├── <RarityGlow />    - Effet de brillance selon rareté
├── <CraftTree />     - Visualisation arbre de craft
├── <EquipmentSlot /> - Slot d'équipement D&D
└── <LoadingCard />   - Skeleton loader
```

---

## 🔧 STACK TECHNIQUE

### Frontend (Obligatoire)
```json
{
  "framework": "Next.js 14+ (App Router)",
  "styling": "Tailwind CSS + Headless UI",
  "animations": "Framer Motion",
  "icons": "Lucide React",
  "state": "Zustand ou React Query",
  "search": "Fuse.js (fuzzy search locale)"
}
```

### Backend/API
```json
{
  "type": "Static generation + Client fetch",
  "data": "JSON files de l'API Dofus Retro",
  "hosting": "Vercel (optimisé pour Next.js)"
}
```

### Performance (exigences strictes)
- Lighthouse score > 90 sur tous les axes
- First Contentful Paint < 1.5s
- Images optimisées (WebP, lazy load)
- Code splitting par page
- Données JSON préchargées / chunkées

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
- **Mobile** : < 640px (navigation drawer, cards full width)
- **Tablet** : 640px - 1024px (sidebar collapsible)
- **Desktop** : > 1024px (layout complet)
- **Large** : > 1440px (max-width container)

### Mobile-first
- Navigation bottom bar (comme les apps)
- Filtres dans un drawer
- Cards en liste verticale
- Touch targets > 44px

---

## 🎯 EXIGENCES UX

### Parcours utilisateur optimisé
```
Arrivée → Search bar immédiatement utilisable
        → 1 clic pour voir un item
        → Filtres visibles sans scroll
        → Panoplie : glisser-déposer intuitif
        → Partage de build en 1 clic
```

### Accessibilité (WCAG AA minimum)
- Contraste 4.5:1 minimum
- Navigation clavier complète
- ARIA labels sur tous les éléments interactifs
- Reduced motion respecté

### Dark mode only
Le site est **nativement dark** (cohérent univers Dofus nuit).

---

## 🚀 LIVRABLES ATTENDUS

1. **Code source complet** (repo GitHub)
2. **README.md** détaillé avec :
   - Installation et lancement
   - Structure du projet
   - Comment ajouter de nouvelles données
3. **Démo déployée** sur Vercel
4. **Documentation des composants** (Storybook ou similaire, optionnel mais +)

---

## 💡 INSPIRATIONS ADDITIONNELLES

- **ElderScrolls Online** : Présentation des sets
- **FFXIV Teamcraft** : Simulateur de craft
- **PoE Trade** : Filtres avancés
- **WoWHead** : Organisation massive de données

---

## ⚠️ CONTRAINTES

- Pas de backend complexe (utilise les JSON de l'API)
- Pas d'authentification nécessaire (site public)
- Données statiques pour l'instant (pas de vraie DB)
- Performance > features (site rapide avant tout)

---

**Mission** : Créer le site de référence pour l'encyclopédie Dofus Retro. Quand un joueur cherche un item, il doit avoir envie d'utiliser TON site plutôt que DofusBook ou le wiki officiel.

**Focus** : Expérience utilisateur fluide, visuels époustouflants, données parfaitement organisées.
