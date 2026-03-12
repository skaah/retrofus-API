import { db, run, get } from '../database';
import { Item, Weapon, Resource, Monster, Set } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// DOFUS RETRO API - DONNÉES ENRICHIES MASSIVEMENT
// ═══════════════════════════════════════════════════════════════════════════════
// 
// Items: 65+ (Dofus, amulettes, anneaux, bottes, capes, ceintures, chapeaux)
// Weapons: 40+ (épées, haches, marteaux, baguettes, arcs, dagues, bâtons, pelles)
// Resources: 55+ (plumes, cuirs, peaux, laines, graines, fleurs, bois, minerais, os, toiles)
// Monsters: 33+ (créatures, oiseaux, insectes, morts-vivants, humanoïdes, boss)
// Sets: 12+ (panoplies complètes avec bonus)
//
// Total: 200+ entrées

// ═══════════════════════════════════════════════════════════════════════════════
// ITEMS (ÉQUIPEMENTS)
// ═══════════════════════════════════════════════════════════════════════════════

const itemsData: Omit<Item, 'id' | 'created_at'>[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // DOFUS (6 items)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 1,
    name: "Dofus Pourpre",
    description: "Un Dofus incroyable qui augmente les caractéristiques de son porteur. Ancien œuf de dragon volé par un aventurier téméraire.",
    type: "dofus",
    level: 6,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2300.png",
    stats: { vitality: "1-100", strength: "1-100", intelligence: "1-100", chance: "1-100", agility: "1-100", wisdom: "1-100" }
  },
  {
    ankama_id: 2,
    name: "Dofus Émeraude",
    description: "Ce Dofus a été créé par Aerafal, le Dragon de l'Air. Il confère une agilité exceptionnelle à son porteur.",
    type: "dofus",
    level: 6,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2301.png",
    stats: { initiative: 200, agility: 50, air_res: 10 }
  },
  {
    ankama_id: 3,
    name: "Dofus Cawotte",
    description: "Ce Dofus a été créé à partir d'une cawotte magique. Parfait pour les chasseurs de trésors.",
    type: "dofus",
    level: 6,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2302.png",
    stats: { prospecting: 10, chance: 30, summons: 1 }
  },
  {
    ankama_id: 4,
    name: "Dofus Turquoise",
    description: "Ce Dofus a été créé par Aguabrial, le Dragon de l'Eau. Il accorde une chance phénoménale.",
    type: "dofus",
    level: 6,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2303.png",
    stats: { chance: 50, water_res: 10, prospecting: 20 }
  },
  {
    ankama_id: 5,
    name: "Dofus Ocre",
    description: "Le Dofus Ocre est l'œuf du dragon Ignemikhal. Il augmente considérablement la vitalité.",
    type: "dofus",
    level: 6,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2304.png",
    stats: { vitality: 100, strength: 30, fire_res: 10 }
  },
  {
    ankama_id: 6,
    name: "Dofus Vulbis",
    description: "Le Dofus Vulbis est l'œuf de dragon le plus rare. Seuls les plus valeureux peuvent l'obtenir.",
    type: "dofus",
    level: 6,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2305.png",
    stats: { pa: 1, wisdom: 50, vitality: 50, all_res: 5 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // AMULETTES (10 items)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 100,
    name: "Amulette du Hibou",
    description: "Cette amulette augmente la sagesse de son porteur. Parfait pour débuter l'aventure.",
    type: "amulette",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/100.png",
    stats: { wisdom: 5 }
  },
  {
    ankama_id: 101,
    name: "Amulette de l'Ours",
    description: "Une amulette qui augmente la force de son porteur. Idéale pour les guerriers.",
    type: "amulette",
    level: 20,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/101.png",
    stats: { strength: 10, vitality: 10 }
  },
  {
    ankama_id: 102,
    name: "Amulette du Kam Assutra",
    description: "Une amulette très puissante qui augmente la vitalité et la sagesse.",
    type: "amulette",
    level: 50,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/102.png",
    stats: { wisdom: 20, vitality: 30, intelligence: 10 }
  },
  {
    ankama_id: 103,
    name: "Amulette de Jolan",
    description: "Cette amulette est recherchée par tous les aventuriers pour ses bonus équilibrés.",
    type: "amulette",
    level: 60,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/103.png",
    stats: { strength: 15, intelligence: 15, chance: 15, agility: 15, wisdom: 15 }
  },
  {
    ankama_id: 104,
    name: "Amulette du Prespic",
    description: "Une amulette faite à partir de crocs de prespic. Augmente l'agilité.",
    type: "amulette",
    level: 40,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/104.png",
    stats: { agility: 20, crit: 2, initiative: 20 }
  },
  {
    ankama_id: 105,
    name: "Amulette du Chafer",
    description: "Une amulette macabre faite à partir d'os de chafer.",
    type: "amulette",
    level: 35,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/105.png",
    stats: { intelligence: 15, fire_dmg: 5, vitality: 10 }
  },
  {
    ankama_id: 106,
    name: "Amulette du Bwork",
    description: "Une amulette massive créée par les bworks.",
    type: "amulette",
    level: 80,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/106.png",
    stats: { strength: 30, vitality: 40, pods: 100 }
  },
  {
    ankama_id: 107,
    name: "Amulette de l'Arakne",
    description: "Une amulette tissée dans la soie d'arakne.",
    type: "amulette",
    level: 15,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/107.png",
    stats: { chance: 10, agility: 5 }
  },
  {
    ankama_id: 108,
    name: "Amulette du Kralamour",
    description: "Une amulette marine aux pouvoirs aquatiques.",
    type: "amulette",
    level: 100,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/108.png",
    stats: { chance: 40, water_dmg: 10, pa: 1 }
  },
  {
    ankama_id: 109,
    name: "Amulette du Koalak",
    description: "Une amulette qui sent le foin et la forêt.",
    type: "amulette",
    level: 70,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/109.png",
    stats: { vitality: 50, strength: 15, wisdom: 10 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ANNEAUX (10 items)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 200,
    name: "Anneau de Sagesse",
    description: "Un simple anneau qui augmente la sagesse.",
    type: "anneau",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/200.png",
    stats: { wisdom: 3 }
  },
  {
    ankama_id: 201,
    name: "Anneau du Bouftou",
    description: "Un anneau fait à partir de laine de bouftou.",
    type: "anneau",
    level: 10,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/201.png",
    stats: { vitality: 5, strength: 5 }
  },
  {
    ankama_id: 202,
    name: "Anneau de Jolan",
    description: "Un anneau très prisé pour ses bonus en force et vitalité.",
    type: "anneau",
    level: 60,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/202.png",
    stats: { strength: 20, vitality: 30, initiative: 20 }
  },
  {
    ankama_id: 203,
    name: "Anneau du Blop",
    description: "Un anneau fait à partir de matière de blop.",
    type: "anneau",
    level: 50,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/203.png",
    stats: { vitality: 20, wisdom: 15, prospecting: 10 }
  },
  {
    ankama_id: 204,
    name: "Anneau du Wabbit",
    description: "Un adorable anneau en forme de wabbit.",
    type: "anneau",
    level: 25,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/204.png",
    stats: { agility: 15, pm: 1 }
  },
  {
    ankama_id: 205,
    name: "Anneau du Tofu",
    description: "Un anneau fait à partir de plume de tofu.",
    type: "anneau",
    level: 5,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/205.png",
    stats: { air_dmg: 3, agility: 5 }
  },
  {
    ankama_id: 206,
    name: "Anneau du Moskito",
    description: "Un anneau léger comme l'aile d'un moskito.",
    type: "anneau",
    level: 15,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/206.png",
    stats: { agility: 8, initiative: 15 }
  },
  {
    ankama_id: 207,
    name: "Anneau du Chafer",
    description: "Un anneau sombre façonné dans l'os des chafers.",
    type: "anneau",
    level: 40,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/207.png",
    stats: { intelligence: 18, fire_dmg: 5 }
  },
  {
    ankama_id: 208,
    name: "Anneau du Kwoan",
    description: "Un anneau légendaire des temps anciens.",
    type: "anneau",
    level: 120,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/208.png",
    stats: { wisdom: 30, vitality: 40, pa: 1 }
  },
  {
    ankama_id: 209,
    name: "Anneau de l'Invocateur",
    description: "Un anneau parfait pour les invocateurs.",
    type: "anneau",
    level: 45,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/209.png",
    stats: { summons: 2, wisdom: 20 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // BOTTES (10 items)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 300,
    name: "Bottes de Poursuite",
    description: "Ces bottes permettent de courir plus vite.",
    type: "bottes",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/300.png",
    stats: { agility: 5 }
  },
  {
    ankama_id: 301,
    name: "Bottes du Chat Botté",
    description: "Des bottes parfaites pour les agilistes.",
    type: "bottes",
    level: 40,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/301.png",
    stats: { agility: 20, pm: 1 }
  },
  {
    ankama_id: 302,
    name: "Bottes du Bouftou",
    description: "Des bottes chaudes en laine de bouftou.",
    type: "bottes",
    level: 12,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/302.png",
    stats: { vitality: 10, strength: 5, pods: 20 }
  },
  {
    ankama_id: 303,
    name: "Bottes du Kwak",
    description: "Des bottes qui font piou piou.",
    type: "bottes",
    level: 35,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/303.png",
    stats: { pm: 1, initiative: 30, agility: 15 }
  },
  {
    ankama_id: 304,
    name: "Bottes de l'Abrakleur",
    description: "Des bottes magiques pour les mages.",
    type: "bottes",
    level: 55,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/304.png",
    stats: { intelligence: 20, pm: 1, range: 1 }
  },
  {
    ankama_id: 305,
    name: "Bottes du Cochon de Lait",
    description: "Des bottes qui font groin groin.",
    type: "bottes",
    level: 30,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/305.png",
    stats: { vitality: 25, chance: 10, pods: 30 }
  },
  {
    ankama_id: 306,
    name: "Bottes du Dragoeuf",
    description: "Des bottes fabriquées à partir d'œufs de dragon.",
    type: "bottes",
    level: 90,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/306.png",
    stats: { vitality: 40, strength: 15, agility: 15, pm: 1 }
  },
  {
    ankama_id: 307,
    name: "Bottes de l'Arakne",
    description: "Des bottes tissées dans la toile d'arakne.",
    type: "bottes",
    level: 18,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/307.png",
    stats: { agility: 12, chance: 8 }
  },
  {
    ankama_id: 308,
    name: "Bottes du Bwork",
    description: "Des bottes massives pour les guerriers.",
    type: "bottes",
    level: 75,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/308.png",
    stats: { vitality: 35, strength: 20, pods: 50 }
  },
  {
    ankama_id: 309,
    name: "Bottes du Chêne Mou",
    description: "Des bottes faites de l'écorce du Chêne Mou.",
    type: "bottes",
    level: 110,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/309.png",
    stats: { vitality: 60, earth_res: 10, wisdom: 15 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // CAPES (10 items)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 400,
    name: "Cape Rouillée",
    description: "Une vieille cape qui sent le moisi.",
    type: "cape",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/400.png",
    stats: { vitality: 5 }
  },
  {
    ankama_id: 401,
    name: "Cape du Sanglier",
    description: "Une cape faite à partir de peau de sanglier.",
    type: "cape",
    level: 15,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/401.png",
    stats: { strength: 10, vitality: 10 }
  },
  {
    ankama_id: 402,
    name: "Cape du Bouftou",
    description: "Une cape chaude et douce.",
    type: "cape",
    level: 10,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/402.png",
    stats: { vitality: 15, wisdom: 5 }
  },
  {
    ankama_id: 403,
    name: "Cape du Wabbit",
    description: "Une cape toute douce en poil de wabbit.",
    type: "cape",
    level: 30,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/403.png",
    stats: { agility: 15, pm: 1, initiative: 20 }
  },
  {
    ankama_id: 404,
    name: "Cape du Prespic",
    description: "Une cape faite à partir de poils de prespic.",
    type: "cape",
    level: 45,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/404.png",
    stats: { agility: 20, crit: 3, air_res: 5 }
  },
  {
    ankama_id: 405,
    name: "Cape du Tofu",
    description: "Une cape légère comme une plume.",
    type: "cape",
    level: 20,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/405.png",
    stats: { air_dmg: 5, agility: 10, range: 1 }
  },
  {
    ankama_id: 406,
    name: "Cape du Blop",
    description: "Une cape colorée faite de matière de blop.",
    type: "cape",
    level: 55,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/406.png",
    stats: { vitality: 30, wisdom: 15, prospecting: 10 }
  },
  {
    ankama_id: 407,
    name: "Cape du Chafer",
    description: "Une cape sombre et effrayante.",
    type: "cape",
    level: 40,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/407.png",
    stats: { intelligence: 20, fire_dmg: 5, initiative: 15 }
  },
  {
    ankama_id: 408,
    name: "Cape du Kralamour",
    description: "Une cape marine aux reflets aquatiques.",
    type: "cape",
    level: 105,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/408.png",
    stats: { chance: 35, water_dmg: 10, pa: 1 }
  },
  {
    ankama_id: 409,
    name: "Cape du Bwork",
    description: "Une cape massive qui pèse une tonne.",
    type: "cape",
    level: 85,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/409.png",
    stats: { vitality: 50, strength: 25, pods: 100 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // CEINTURES (9 items)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 500,
    name: "Ceinture de Force",
    description: "Une ceinture qui augmente la force.",
    type: "ceinture",
    level: 25,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/500.png",
    stats: { strength: 15, pods: 50 }
  },
  {
    ankama_id: 501,
    name: "Ceinture du Bandit",
    description: "Une ceinture volée à un bandit.",
    type: "ceinture",
    level: 35,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/501.png",
    stats: { chance: 15, agility: 10, initiative: 20 }
  },
  {
    ankama_id: 502,
    name: "Ceinture du Bouftou",
    description: "Une ceinture en laine de bouftou.",
    type: "ceinture",
    level: 14,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/502.png",
    stats: { vitality: 15, strength: 8, pods: 30 }
  },
  {
    ankama_id: 503,
    name: "Ceinture du Wabbit",
    description: "Une ceinture avec une queue de wabbit.",
    type: "ceinture",
    level: 32,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/503.png",
    stats: { agility: 18, pm: 1 }
  },
  {
    ankama_id: 504,
    name: "Ceinture du Prespic",
    description: "Une ceinture avec des pics.",
    type: "ceinture",
    level: 48,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/504.png",
    stats: { agility: 22, crit: 2, vitality: 15 }
  },
  {
    ankama_id: 505,
    name: "Ceinture du Tofu",
    description: "Une ceinture légère.",
    type: "ceinture",
    level: 18,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/505.png",
    stats: { agility: 12, air_dmg: 3 }
  },
  {
    ankama_id: 506,
    name: "Ceinture du Blop",
    description: "Une ceinture colorée.",
    type: "ceinture",
    level: 58,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/506.png",
    stats: { vitality: 25, wisdom: 12, prospecting: 8 }
  },
  {
    ankama_id: 507,
    name: "Ceinture du Chafer",
    description: "Une ceinture sombre.",
    type: "ceinture",
    level: 42,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/507.png",
    stats: { intelligence: 18, fire_dmg: 4 }
  },
  {
    ankama_id: 508,
    name: "Ceinture du Bwork",
    description: "Une ceinture massive.",
    type: "ceinture",
    level: 82,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/508.png",
    stats: { vitality: 40, strength: 20, pods: 80 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // CHAPEAUX (10 items)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 600,
    name: "Chapeau de l'Aventurier",
    description: "Un chapeau pour les grands aventuriers.",
    type: "chapeau",
    level: 30,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/600.png",
    stats: { wisdom: 10, prospecting: 5 }
  },
  {
    ankama_id: 601,
    name: "Chapeau du Bouftou",
    description: "Un chapeau avec des cornes de bouftou.",
    type: "chapeau",
    level: 16,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/601.png",
    stats: { vitality: 20, strength: 8 }
  },
  {
    ankama_id: 602,
    name: "Chapeau du Wabbit",
    description: "Un adorable chapeau avec des oreilles de wabbit.",
    type: "chapeau",
    level: 35,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/602.png",
    stats: { agility: 18, pm: 1, vitality: 15 }
  },
  {
    ankama_id: 603,
    name: "Chapeau du Tofu",
    description: "Un chapeau fait de plumes de tofu.",
    type: "chapeau",
    level: 22,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/603.png",
    stats: { air_dmg: 6, agility: 12 }
  },
  {
    ankama_id: 604,
    name: "Chapeau du Prespic",
    description: "Un chapeau avec des poils de prespic.",
    type: "chapeau",
    level: 50,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/604.png",
    stats: { agility: 25, crit: 3, initiative: 25 }
  },
  {
    ankama_id: 605,
    name: "Chapeau du Blop",
    description: "Un chapeau multicolore.",
    type: "chapeau",
    level: 60,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/605.png",
    stats: { vitality: 35, wisdom: 15, prospecting: 12 }
  },
  {
    ankama_id: 606,
    name: "Chapeau du Chafer",
    description: "Un crâne de chafer comme chapeau.",
    type: "chapeau",
    level: 45,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/606.png",
    stats: { intelligence: 25, fire_dmg: 6, vitality: 10 }
  },
  {
    ankama_id: 607,
    name: "Chapeau du Bwork",
    description: "Un casque de bwork.",
    type: "chapeau",
    level: 88,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/607.png",
    stats: { vitality: 55, strength: 25, wisdom: -10 }
  },
  {
    ankama_id: 608,
    name: "Chapeau du Kralamour",
    description: "Un chapeau marin.",
    type: "chapeau",
    level: 108,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/608.png",
    stats: { chance: 40, water_dmg: 12, pa: 1 }
  },
  {
    ankama_id: 609,
    name: "Chapeau du Chêne Mou",
    description: "Un chapeau fait de feuilles d'or.",
    type: "chapeau",
    level: 115,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/609.png",
    stats: { vitality: 70, earth_res: 15, wisdom: 20 }
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ARMES
// ═══════════════════════════════════════════════════════════════════════════════

const weaponsData: Omit<Weapon, 'id' | 'created_at'>[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // ÉPÉES (8 armes)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 1000,
    name: "Épée de Boisaille",
    description: "Une épée en bois pour les débutants.",
    type: "épée",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1000.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 5,
    base_damage: { neutral: "1-5" },
    stats: { vitality: 2 }
  },
  {
    ankama_id: 1001,
    name: "Épée du Bouftou",
    description: "Une épée forgée à partir des cornes de bouftou.",
    type: "épée",
    level: 10,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1001.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 5,
    base_damage: { neutral: "6-10" },
    stats: { strength: 5, vitality: 5 }
  },
  {
    ankama_id: 1002,
    name: "Épée du Paysan",
    description: "Une épée pour les paysans en herbe.",
    type: "épée",
    level: 5,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1002.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 5,
    base_damage: { neutral: "2-6" },
    conditions: ["Force > 10"],
    stats: { strength: 3 }
  },
  {
    ankama_id: 1003,
    name: "Épée du Chevalier",
    description: "Une épée noble pour les chevaliers.",
    type: "épée",
    level: 50,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1003.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 10,
    crit_bonus: 10,
    base_damage: { neutral: "15-25", fire: "3-5" },
    conditions: ["Force > 60", "Vitalité > 200"],
    stats: { strength: 20, vitality: 30 }
  },
  {
    ankama_id: 1004,
    name: "Épée de Flavus",
    description: "Une épée légendaire de feu.",
    type: "épée",
    level: 80,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1004.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 15,
    crit_bonus: 15,
    base_damage: { fire: "20-35", neutral: "10-15" },
    conditions: ["Intelligence > 100", "Force > 50"],
    stats: { intelligence: 30, fire_dmg: 15 }
  },
  {
    ankama_id: 1005,
    name: "Épée de Kain",
    description: "L'épée du célèbre aventurier Kain.",
    type: "épée",
    level: 65,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1005.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 10,
    crit_bonus: 10,
    base_damage: { neutral: "18-28" },
    conditions: ["Force > 80"],
    stats: { strength: 25, vitality: 40, crit: 3 }
  },
  {
    ankama_id: 1006,
    name: "Épée Gloursonne",
    description: "Une épée massive des glours.",
    type: "épée",
    level: 110,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1006.png",
    ap_cost: 5,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 20,
    base_damage: { neutral: "30-50", earth: "10-20" },
    conditions: ["Force > 120", "Vitalité > 400"],
    stats: { strength: 40, vitality: 60, pods: 50 }
  },
  {
    ankama_id: 1007,
    name: "Épée du Maître des clefs",
    description: "L'épée du gardien des donjons.",
    type: "épée",
    level: 130,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1007.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 15,
    crit_bonus: 15,
    base_damage: { neutral: "25-40", fire: "10-15", water: "10-15", air: "10-15", earth: "10-15" },
    conditions: ["Force > 100", "Intelligence > 100", "Chance > 100", "Agilité > 100"],
    stats: { strength: 25, intelligence: 25, chance: 25, agility: 25, wisdom: 25 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // HACHES (5 armes)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 1100,
    name: "Hache de Brâââm",
    description: "Une hache légendaire pour les iops.",
    type: "hache",
    level: 40,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1100.png",
    ap_cost: 5,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 15,
    base_damage: { neutral: "20-35", fire: "5-15" },
    conditions: ["Force > 50", "Vitalité > 100"],
    stats: { strength: 20, vitality: 30 }
  },
  {
    ankama_id: 1101,
    name: "Hache du Bwork",
    description: "Une hache massive de guerre.",
    type: "hache",
    level: 75,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1101.png",
    ap_cost: 5,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 20,
    base_damage: { neutral: "28-45", earth: "8-15" },
    conditions: ["Force > 90"],
    stats: { strength: 35, vitality: 50 }
  },
  {
    ankama_id: 1102,
    name: "Hache de Guerre",
    description: "Une hache standard des armées.",
    type: "hache",
    level: 30,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1102.png",
    ap_cost: 5,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 10,
    base_damage: { neutral: "15-25" },
    conditions: ["Force > 40"],
    stats: { strength: 15, vitality: 10 }
  },
  {
    ankama_id: 1103,
    name: "Hache de l'Abraknyde",
    description: "Une hache faite de l'arbre des Abraknydes.",
    type: "hache",
    level: 55,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1103.png",
    ap_cost: 5,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 10,
    crit_bonus: 15,
    base_damage: { earth: "20-30", neutral: "8-12" },
    conditions: ["Force > 60"],
    stats: { strength: 20, vitality: 25, earth_res: 5 }
  },
  {
    ankama_id: 1104,
    name: "Hache du Chêne Mou",
    description: "Une hache vivante.",
    type: "hache",
    level: 120,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1104.png",
    ap_cost: 5,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 10,
    crit_bonus: 20,
    base_damage: { earth: "35-55", neutral: "15-25" },
    conditions: ["Force > 150", "Sagesse > 50"],
    stats: { strength: 45, vitality: 80, earth_dmg: 15 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // MARTEAUX (5 armes)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 1200,
    name: "Marteau de l'Écaflip",
    description: "Un marteau pour les écaflips chanceux.",
    type: "marteau",
    level: 30,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1200.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 10,
    base_damage: { neutral: "15-25", earth: "5-10" },
    conditions: ["Chance > 40", "Force > 20"],
    stats: { chance: 10, strength: 5 }
  },
  {
    ankama_id: 1201,
    name: "Marteau du Chafer",
    description: "Un marteau d'os qui frappe fort.",
    type: "marteau",
    level: 45,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1201.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 15,
    base_damage: { neutral: "20-30", fire: "5-10" },
    conditions: ["Force > 50"],
    stats: { strength: 18, vitality: 20, intelligence: 10 }
  },
  {
    ankama_id: 1202,
    name: "Marteau de la Terre",
    description: "Un marteau qui fait trembler la terre.",
    type: "marteau",
    level: 60,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1202.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 15,
    base_damage: { earth: "25-35", neutral: "8-12" },
    conditions: ["Force > 70"],
    stats: { strength: 25, vitality: 30, earth_dmg: 8 }
  },
  {
    ankama_id: 1203,
    name: "Marteau de la Forgelance",
    description: "Le marteau du dieu Iop.",
    type: "marteau",
    level: 100,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1203.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 15,
    crit_bonus: 20,
    base_damage: { neutral: "30-45", fire: "10-15" },
    conditions: ["Force > 120", "Vitalité > 300"],
    stats: { strength: 40, vitality: 60, crit: 5 }
  },
  {
    ankama_id: 1204,
    name: "Marteau du Bwork",
    description: "Un marteau de guerre massif.",
    type: "marteau",
    level: 85,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1204.png",
    ap_cost: 5,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 25,
    base_damage: { neutral: "28-42", earth: "10-18" },
    conditions: ["Force > 100", "Vitalité > 250"],
    stats: { strength: 35, vitality: 50, pods: 100 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // BAGUETTES (5 armes)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 1300,
    name: "Baguette de Glace",
    description: "Une baguette qui inflige des dommages d'eau.",
    type: "baguette",
    level: 15,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1300.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 2,
    range_max: 4,
    crit_chance: 5,
    crit_bonus: 10,
    base_damage: { water: "8-12" },
    conditions: ["Intelligence > 20"],
    stats: { intelligence: 5 }
  },
  {
    ankama_id: 1301,
    name: "Baguette de Feu",
    description: "Une baguette qui crache des flammes.",
    type: "baguette",
    level: 25,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1301.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 2,
    range_max: 4,
    crit_chance: 5,
    crit_bonus: 10,
    base_damage: { fire: "12-18" },
    conditions: ["Intelligence > 30"],
    stats: { intelligence: 10, fire_dmg: 5 }
  },
  {
    ankama_id: 1302,
    name: "Baguette de l'Abrakleur",
    description: "Une baguette magique des Abrakles.",
    type: "baguette",
    level: 60,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1302.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 2,
    range_max: 5,
    crit_chance: 10,
    crit_bonus: 15,
    base_damage: { water: "20-30", fire: "10-15" },
    conditions: ["Intelligence > 80", "Sagesse > 30"],
    stats: { intelligence: 25, wisdom: 15, range: 1 }
  },
  {
    ankama_id: 1303,
    name: "Baguette du Kralamour",
    description: "Une baguette marine puissante.",
    type: "baguette",
    level: 110,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1303.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 2,
    range_max: 6,
    crit_chance: 10,
    crit_bonus: 20,
    base_damage: { water: "30-45", neutral: "10-15" },
    conditions: ["Intelligence > 120", "Chance > 80"],
    stats: { intelligence: 40, chance: 20, water_dmg: 15, pa: 1 }
  },
  {
    ankama_id: 1304,
    name: "Baguette d'Ouginak",
    description: "Une baguette primitive mais efficace.",
    type: "baguette",
    level: 40,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1304.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 2,
    range_max: 4,
    crit_chance: 5,
    crit_bonus: 10,
    base_damage: { fire: "15-22", earth: "5-8" },
    conditions: ["Intelligence > 50"],
    stats: { intelligence: 15, strength: 8 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ARCS (5 armes)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 1400,
    name: "Arc de Boisaille",
    description: "Un arc en bois pour les apprentis chasseurs.",
    type: "arc",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1400.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 2,
    range_max: 5,
    crit_chance: 10,
    crit_bonus: 5,
    base_damage: { neutral: "2-4" },
    stats: { agility: 2 }
  },
  {
    ankama_id: 1401,
    name: "Arc de l'Eleveur de Bouftous",
    description: "Un arc parfait pour chasser les bouftous.",
    type: "arc",
    level: 20,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1401.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 2,
    range_max: 6,
    crit_chance: 10,
    crit_bonus: 5,
    base_damage: { air: "10-15" },
    conditions: ["Agilité > 30"],
    stats: { agility: 10, vitality: 10 }
  },
  {
    ankama_id: 1402,
    name: "Arc Piven",
    description: "Un arc légendaire pour les agilistes.",
    type: "arc",
    level: 55,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1402.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 2,
    range_max: 7,
    crit_chance: 15,
    crit_bonus: 10,
    base_damage: { air: "20-30", neutral: "5-10" },
    conditions: ["Agilité > 80"],
    stats: { agility: 25, crit: 3, initiative: 20 }
  },
  {
    ankama_id: 1403,
    name: "Arc du Prespic",
    description: "Un arc fait de pics de prespic.",
    type: "arc",
    level: 45,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1403.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 2,
    range_max: 6,
    crit_chance: 15,
    crit_bonus: 10,
    base_damage: { air: "15-25", earth: "3-6" },
    conditions: ["Agilité > 60", "Force > 30"],
    stats: { agility: 20, strength: 10, crit: 2 }
  },
  {
    ankama_id: 1404,
    name: "Arc du Wabbit",
    description: "Un arc blanc comme la neige.",
    type: "arc",
    level: 35,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1404.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 2,
    range_max: 6,
    crit_chance: 10,
    crit_bonus: 8,
    base_damage: { neutral: "12-18" },
    conditions: ["Agilité > 50"],
    stats: { agility: 18, pm: 1 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // DAGUES (5 armes)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 1500,
    name: "Dagues de Fouraille",
    description: "Des dagues pour les agilistes.",
    type: "dague",
    level: 25,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1500.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 15,
    crit_bonus: 5,
    base_damage: { air: "12-18" },
    conditions: ["Agilité > 35"],
    stats: { agility: 15, crit: 3 }
  },
  {
    ankama_id: 1501,
    name: "Dagues Brumeuses",
    description: "Des dagues qui frappent dans la brume.",
    type: "dague",
    level: 65,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1501.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 20,
    crit_bonus: 10,
    base_damage: { air: "22-32", neutral: "8-12" },
    conditions: ["Agilité > 90", "Chance > 50"],
    stats: { agility: 30, chance: 15, crit: 5, initiative: 30 }
  },
  {
    ankama_id: 1502,
    name: "Dagues du Wabbit",
    description: "Des dagues avec des oreilles.",
    type: "dague",
    level: 40,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1502.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 15,
    crit_bonus: 8,
    base_damage: { neutral: "15-22" },
    conditions: ["Agilité > 55"],
    stats: { agility: 20, pm: 1 }
  },
  {
    ankama_id: 1503,
    name: "Dagues de l'Araignée",
    description: "Des dagues empoisonnées.",
    type: "dague",
    level: 50,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1503.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 15,
    crit_bonus: 10,
    base_damage: { air: "18-25", water: "5-8" },
    conditions: ["Agilité > 70"],
    stats: { agility: 22, chance: 10, crit: 3 }
  },
  {
    ankama_id: 1504,
    name: "Dagues du Chafer",
    description: "Des dagues d'os tranchantes.",
    type: "dague",
    level: 55,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1504.png",
    ap_cost: 3,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 10,
    crit_bonus: 15,
    base_damage: { fire: "15-22", neutral: "8-12" },
    conditions: ["Agilité > 65", "Intelligence > 40"],
    stats: { agility: 18, intelligence: 12, fire_dmg: 5 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // BÂTONS (4 armes)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 1600,
    name: "Bâton de l'Apprenti",
    description: "Un bâton pour les apprentis mages.",
    type: "bâton",
    level: 8,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1600.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 5,
    base_damage: { neutral: "5-8" },
    stats: { wisdom: 5, intelligence: 3 }
  },
  {
    ankama_id: 1601,
    name: "Bâton du Tofu",
    description: "Un bâton fait de plumes.",
    type: "bâton",
    level: 18,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1601.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 8,
    base_damage: { air: "8-12", neutral: "3-5" },
    conditions: ["Intelligence > 25", "Agilité > 15"],
    stats: { agility: 10, intelligence: 8 }
  },
  {
    ankama_id: 1602,
    name: "Bâton de l'Abraknyde",
    description: "Un bâton vivant.",
    type: "bâton",
    level: 65,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1602.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 10,
    crit_bonus: 15,
    base_damage: { earth: "20-28", neutral: "6-10" },
    conditions: ["Intelligence > 70", "Force > 40"],
    stats: { intelligence: 20, strength: 12, wisdom: 10 }
  },
  {
    ankama_id: 1603,
    name: "Bâton du Bwork",
    description: "Un gourdin massif.",
    type: "bâton",
    level: 78,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1603.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 20,
    base_damage: { neutral: "22-35", earth: "8-15" },
    conditions: ["Force > 100", "Intelligence > 40"],
    stats: { strength: 25, vitality: 30, pods: 50 }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PELLES (3 armes)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 1700,
    name: "Pelle de l'Enutrof",
    description: "Une pelle pour les chasseurs de trésors.",
    type: "pelle",
    level: 35,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1700.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 5,
    base_damage: { earth: "15-22" },
    conditions: ["Chance > 30"],
    stats: { chance: 10, prospecting: 10, pods: 50 }
  },
  {
    ankama_id: 1701,
    name: "Pelle du Chafer",
    description: "Une pelle d'os pour terrasser les morts.",
    type: "pelle",
    level: 50,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1701.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 10,
    base_damage: { neutral: "18-28", fire: "5-10" },
    conditions: ["Chance > 50", "Force > 30"],
    stats: { chance: 15, strength: 10, prospecting: 15 }
  },
  {
    ankama_id: 1702,
    name: "Pelle de la Terre",
    description: "Une pelle qui fait trembler la terre.",
    type: "pelle",
    level: 70,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/1702.png",
    ap_cost: 4,
    uses_per_turn: 1,
    range_min: 1,
    range_max: 1,
    crit_chance: 5,
    crit_bonus: 15,
    base_damage: { earth: "25-35", neutral: "8-12" },
    conditions: ["Chance > 80", "Force > 50"],
    stats: { chance: 20, strength: 15, prospecting: 20, pods: 100 }
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// RESSOURCES
// ═══════════════════════════════════════════════════════════════════════════════

const resourcesData: Omit<Resource, 'id' | 'created_at'>[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // LAINE / PEAU / CUIR (10 ressources)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 2000,
    name: "Laine de Bouftou",
    description: "De la laine douce prélevée sur un bouftou.",
    type: "laine",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2000.png"
  },
  {
    ankama_id: 2001,
    name: "Cuir de Bouftou",
    description: "Du cuir résistant de bouftou.",
    type: "cuir",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2001.png"
  },
  {
    ankama_id: 2002,
    name: "Laine de Bouftou Noir",
    description: "De la laine noire plus rare.",
    type: "laine",
    level: 10,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2002.png"
  },
  {
    ankama_id: 2003,
    name: "Peau de Sanglier",
    description: "Une peau rugueuse de sanglier.",
    type: "peau",
    level: 5,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2003.png"
  },
  {
    ankama_id: 2004,
    name: "Peau de Wabbit",
    description: "Une peau douce de wabbit.",
    type: "peau",
    level: 25,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2004.png"
  },
  {
    ankama_id: 2005,
    name: "Cuir de Wabbit",
    description: "Du cuir de wabbit de qualité.",
    type: "cuir",
    level: 30,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2005.png"
  },
  {
    ankama_id: 2006,
    name: "Peau de Prespic",
    description: "Une peau couverte de pics.",
    type: "peau",
    level: 40,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2006.png"
  },
  {
    ankama_id: 2007,
    name: "Peau de Bwork",
    description: "Une peau épaisse et résistante.",
    type: "peau",
    level: 80,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2007.png"
  },
  {
    ankama_id: 2008,
    name: "Laine de Tofu",
    description: "Des plumes molles de tofu.",
    type: "laine",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2008.png"
  },
  {
    ankama_id: 2009,
    name: "Peau de Blop",
    description: "Une peau gélatineuse multicolore.",
    type: "peau",
    level: 50,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2009.png"
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PLUMES / AILES (8 ressources)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 2100,
    name: "Plume de Tofu",
    description: "Une plume colorée de tofu.",
    type: "plume",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2100.png"
  },
  {
    ankama_id: 2101,
    name: "Aile de Moskito",
    description: "Une aile fragile de moskito.",
    type: "plume",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2101.png"
  },
  {
    ankama_id: 2102,
    name: "Plume de Kwak",
    description: "Une plume électrique de kwak.",
    type: "plume",
    level: 35,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2102.png"
  },
  {
    ankama_id: 2103,
    name: "Plume de Tofu Royal",
    description: "Une plume dorée du roi des tofu.",
    type: "plume",
    level: 40,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2103.png"
  },
  {
    ankama_id: 2104,
    name: "Aile de Tofu",
    description: "Une aile de tofu tout à fait banale.",
    type: "plume",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2104.png"
  },
  {
    ankama_id: 2105,
    name: "Plume de Prespic",
    description: "Une plume piquante.",
    type: "plume",
    level: 45,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2105.png"
  },
  {
    ankama_id: 2106,
    name: "Plume de Piwat",
    description: "Une plume de l'oiseau rare.",
    type: "plume",
    level: 20,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2106.png"
  },
  {
    ankama_id: 2107,
    name: "Aile de Corbac",
    description: "Une aile noire de corbac.",
    type: "plume",
    level: 60,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2107.png"
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // BOIS (6 ressources)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 2200,
    name: "Frêne",
    description: "Du bois de frêne commun.",
    type: "bois",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2200.png"
  },
  {
    ankama_id: 2201,
    name: "Chêne",
    description: "Du bois de chêne robuste.",
    type: "bois",
    level: 10,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2201.png"
  },
  {
    ankama_id: 2202,
    name: "If",
    description: "Du bois d'if rare et précieux.",
    type: "bois",
    level: 50,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2202.png"
  },
  {
    ankama_id: 2203,
    name: "Ébène",
    description: "Du bois d'ébène noir comme la nuit.",
    type: "bois",
    level: 70,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2203.png"
  },
  {
    ankama_id: 2204,
    name: "Kaliptus",
    description: "Du bois de l'Outre-monde.",
    type: "bois",
    level: 90,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2204.png"
  },
  {
    ankama_id: 2205,
    name: "Merisier",
    description: "Du bois de merisier tendre.",
    type: "bois",
    level: 30,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2205.png"
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // MINERAIS (8 ressources)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 2300,
    name: "Fer",
    description: "Un minerai de fer basique.",
    type: "minerai",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2300.png"
  },
  {
    ankama_id: 2301,
    name: "Cuivre",
    description: "Un minerai de cuivre orange.",
    type: "minerai",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2301.png"
  },
  {
    ankama_id: 2302,
    name: "Bronze",
    description: "Un alliage de cuivre et d'étain.",
    type: "minerai",
    level: 10,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2302.png"
  },
  {
    ankama_id: 2303,
    name: "Argent",
    description: "Un minerai d'argent précieux.",
    type: "minerai",
    level: 40,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2303.png"
  },
  {
    ankama_id: 2304,
    name: "Or",
    description: "Un minerai d'or très précieux.",
    type: "minerai",
    level: 60,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2304.png"
  },
  {
    ankama_id: 2305,
    name: "Bauxite",
    description: "Un minerai rouge contenant de l'aluminium.",
    type: "minerai",
    level: 80,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2305.png"
  },
  {
    ankama_id: 2306,
    name: "Étain",
    description: "Un minerai d'étain gris.",
    type: "minerai",
    level: 20,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2306.png"
  },
  {
    ankama_id: 2307,
    name: "Manganèse",
    description: "Un minerai violet rare.",
    type: "minerai",
    level: 100,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2307.png"
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // GRAINE / FLEUR / FEUILLE (8 ressources)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 2400,
    name: "Blé",
    description: "Des épis de blé.",
    type: "graine",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2400.png"
  },
  {
    ankama_id: 2401,
    name: "Orge",
    description: "Des grains d'orge.",
    type: "graine",
    level: 5,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2401.png"
  },
  {
    ankama_id: 2402,
    name: "Avoine",
    description: "Des grains d'avoine.",
    type: "graine",
    level: 10,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2402.png"
  },
  {
    ankama_id: 2403,
    name: "Houblon",
    description: "Des fleurs de houblon pour la bière.",
    type: "fleur",
    level: 20,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2403.png"
  },
  {
    ankama_id: 2404,
    name: "Fraise",
    description: "Une fraise juteuse.",
    type: "fleur",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2404.png"
  },
  {
    ankama_id: 2405,
    name: "Menthe Sauvage",
    description: "Des feuilles de menthe fraîche.",
    type: "feuille",
    level: 15,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2405.png"
  },
  {
    ankama_id: 2406,
    name: "Trèfle à 5 Feuilles",
    description: "Un trèfle porte-bonheur.",
    type: "feuille",
    level: 25,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2406.png"
  },
  {
    ankama_id: 2407,
    name: "Orchidée Freyesque",
    description: "Une fleur rare et précieuse.",
    type: "fleur",
    level: 50,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2407.png"
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // OS / CARcasse / TOILE (7 ressources)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 2500,
    name: "Corne de Bouftou",
    description: "Une corne de bouftou.",
    type: "os",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2500.png"
  },
  {
    ankama_id: 2501,
    name: "Os de Chafer",
    description: "Un os de squelette.",
    type: "os",
    level: 20,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2501.png"
  },
  {
    ankama_id: 2502,
    name: "Carcasse de Tofu",
    description: "Les restes d'un tofu.",
    type: "carcasse",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2502.png"
  },
  {
    ankama_id: 2503,
    name: "Toile d'Araignée",
    description: "Une toile collante.",
    type: "toile",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2503.png"
  },
  {
    ankama_id: 2504,
    name: "Os de Wabbit",
    description: "Un os de wabbit fragile.",
    type: "os",
    level: 30,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2504.png"
  },
  {
    ankama_id: 2505,
    name: "Carcasse de Moskito",
    description: "Un cadavre de moustique.",
    type: "carcasse",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2505.png"
  },
  {
    ankama_id: 2506,
    name: "Toile d'Abraknyde",
    description: "Une toile magique d'arakne géante.",
    type: "toile",
    level: 60,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2506.png"
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // DIVERSES (8 ressources)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 2600,
    name: "Bave de Tofu",
    description: "De la bave visqueuse de tofu.",
    type: "ressource_diverse",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2600.png"
  },
  {
    ankama_id: 2601,
    name: "Queue de Tofu",
    description: "Une queue de tofu.",
    type: "ressource_diverse",
    level: 1,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2601.png"
  },
  {
    ankama_id: 2602,
    name: "Défense de Sanglier",
    description: "Une défense pointue.",
    type: "os",
    level: 5,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2602.png"
  },
  {
    ankama_id: 2603,
    name: "Gland",
    description: "Un gland de chêne.",
    type: "ressource_diverse",
    level: 15,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2603.png"
  },
  {
    ankama_id: 2604,
    name: "Pierre de Cristal",
    description: "Une pierre magique brillante.",
    type: "ressource_diverse",
    level: 40,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2604.png"
  },
  {
    ankama_id: 2605,
    name: "Écorce de Bwork",
    description: "L'écorce verte du Bwork.",
    type: "ressource_diverse",
    level: 80,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2605.png"
  },
  {
    ankama_id: 2606,
    name: "Graine de Blop",
    description: "Une graine de la matière blop.",
    type: "graine",
    level: 50,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2606.png"
  },
  {
    ankama_id: 2607,
    name: "Huile de Tournesol",
    description: "De l'huile pour cuisiner.",
    type: "huile",
    level: 10,
    image_url: "https://static.ankama.com/dofus/www/game/items/200/2607.png"
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MONSTRES
// ═══════════════════════════════════════════════════════════════════════════════

const monstersData: Omit<Monster, 'id' | 'created_at'>[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // BASICS - ZONE ASTRUB/INCARNAM (8 monstres)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 3000,
    name: "Bouftou",
    description: "Un mouton paisible qui devient agressif si on le provoque.",
    race: "créature",
    level_min: 1,
    level_max: 5,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3000.png",
    stats: { hp: 20, pa: 4, pm: 3, initiative: 10 },
    resistances: { neutral: 0, earth: 0, fire: -10, water: 0, air: 0 },
    drops: [
      { resource_id: 2000, resource_name: "Laine de Bouftou", rate: "60%" },
      { resource_id: 2001, resource_name: "Cuir de Bouftou", rate: "30%" },
      { resource_id: 2500, resource_name: "Corne de Bouftou", rate: "15%" }
    ],
    zones: ["Astrub", "Champ de Cania", "Incarnam"]
  },
  {
    ankama_id: 3001,
    name: "Bouftou Noir",
    description: "Un bouftou plus coriace que la moyenne.",
    race: "créature",
    level_min: 6,
    level_max: 12,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3001.png",
    stats: { hp: 45, pa: 4, pm: 3, initiative: 15 },
    resistances: { neutral: 5, earth: 0, fire: -5, water: 0, air: 0 },
    drops: [
      { resource_id: 2000, resource_name: "Laine de Bouftou", rate: "70%" },
      { resource_id: 2001, resource_name: "Cuir de Bouftou", rate: "40%" },
      { resource_id: 2500, resource_name: "Corne de Bouftou", rate: "20%" }
    ],
    zones: ["Astrub", "Champ de Cania"]
  },
  {
    ankama_id: 3002,
    name: "Tofu",
    description: "Un oiseau coloré et bruyant.",
    race: "oiseau",
    level_min: 1,
    level_max: 4,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3002.png",
    stats: { hp: 15, pa: 3, pm: 4, initiative: 20 },
    resistances: { neutral: -10, earth: 0, fire: 0, water: 0, air: 10 },
    drops: [
      { resource_id: 2100, resource_name: "Plume de Tofu", rate: "50%" },
      { resource_id: 2600, resource_name: "Bave de Tofu", rate: "25%" }
    ],
    zones: ["Astrub", "Forêt d'Astrub", "Incarnam"]
  },
  {
    ankama_id: 3003,
    name: "Sanglier",
    description: "Un sanglier agressif qui charge les aventuriers.",
    race: "créature",
    level_min: 5,
    level_max: 10,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3003.png",
    stats: { hp: 60, pa: 4, pm: 3, initiative: 8 },
    resistances: { neutral: 0, earth: 10, fire: 0, water: -5, air: 0 },
    drops: [
      { resource_id: 2003, resource_name: "Peau de Sanglier", rate: "40%" },
      { resource_id: 2602, resource_name: "Défense de Sanglier", rate: "20%" }
    ],
    zones: ["Astrub", "Forêt d'Astrub"]
  },
  {
    ankama_id: 3004,
    name: "Moskito",
    description: "Un insecte volant qui aspire le sang.",
    race: "insecte",
    level_min: 2,
    level_max: 6,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3004.png",
    stats: { hp: 18, pa: 3, pm: 5, initiative: 25 },
    resistances: { neutral: -5, earth: 0, fire: 0, water: 0, air: 5 },
    drops: [
      { resource_id: 2101, resource_name: "Aile de Moskito", rate: "45%" }
    ],
    zones: ["Astrub", "Forêt d'Astrub", "Incarnam"]
  },
  {
    ankama_id: 3005,
    name: "Araignée",
    description: "Une araignée qui tisse ses toiles dans les forêts.",
    race: "insecte",
    level_min: 1,
    level_max: 4,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3005.png",
    stats: { hp: 12, pa: 3, pm: 2, initiative: 5 },
    resistances: { neutral: 0, earth: 5, fire: -10, water: 0, air: 0 },
    drops: [
      { resource_id: 2503, resource_name: "Toile d'Araignée", rate: "55%" }
    ],
    zones: ["Astrub", "Forêt d'Astrub", "Incarnam"]
  },
  {
    ankama_id: 3006,
    name: "Chafer",
    description: "Un squelette revenant à la vie.",
    race: "mort-vivant",
    level_min: 15,
    level_max: 25,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3006.png",
    stats: { hp: 100, pa: 5, pm: 3, initiative: 12 },
    resistances: { neutral: 5, earth: 10, fire: -20, water: 0, air: 0 },
    drops: [
      { resource_id: 2501, resource_name: "Os de Chafer", rate: "35%" }
    ],
    zones: ["Cimetière", "Cimetière d'Astrub"]
  },
  {
    ankama_id: 3007,
    name: "Bandit",
    description: "Un brigand qui attaque les voyageurs.",
    race: "humanoïde",
    level_min: 10,
    level_max: 20,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3007.png",
    stats: { hp: 80, pa: 4, pm: 3, initiative: 15 },
    resistances: { neutral: 0, earth: 0, fire: 0, water: 0, air: 0 },
    drops: [],
    zones: ["Route d'Astrub"]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // MONSTRES INTERMÉDIAIRES (8 monstres)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 3008,
    name: "Wabbit",
    description: "Un lapin carnivore et dangereux.",
    race: "créature",
    level_min: 25,
    level_max: 35,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3008.png",
    stats: { hp: 120, pa: 5, pm: 4, initiative: 30 },
    resistances: { neutral: 0, earth: 5, fire: -10, water: 0, air: 10 },
    drops: [
      { resource_id: 2004, resource_name: "Peau de Wabbit", rate: "40%" },
      { resource_id: 2504, resource_name: "Os de Wabbit", rate: "25%" }
    ],
    zones: ["Île de Wabbit"]
  },
  {
    ankama_id: 3009,
    name: "Tofu Maléfique",
    description: "Un tofu corrompu par la magie noire.",
    race: "oiseau",
    level_min: 20,
    level_max: 30,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3009.png",
    stats: { hp: 80, pa: 4, pm: 4, initiative: 35 },
    resistances: { neutral: 0, earth: -5, fire: 10, water: 0, air: 15 },
    drops: [
      { resource_id: 2100, resource_name: "Plume de Tofu", rate: "60%" },
      { resource_id: 2601, resource_name: "Queue de Tofu", rate: "30%" }
    ],
    zones: ["Forêt d'Astrub", "Forêt maléfique"]
  },
  {
    ankama_id: 3010,
    name: "Prespic",
    description: "Un porc-épic géant et agressif.",
    race: "créature",
    level_min: 40,
    level_max: 50,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3010.png",
    stats: { hp: 180, pa: 5, pm: 3, initiative: 20 },
    resistances: { neutral: 10, earth: 15, fire: 0, water: -5, air: 0 },
    drops: [
      { resource_id: 2006, resource_name: "Peau de Prespic", rate: "35%" },
      { resource_id: 2105, resource_name: "Plume de Prespic", rate: "20%" }
    ],
    zones: ["Forêt de Terrdala"]
  },
  {
    ankama_id: 3011,
    name: "Arakne",
    description: "Une araignée géante venimeuse.",
    race: "insecte",
    level_min: 15,
    level_max: 25,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3011.png",
    stats: { hp: 90, pa: 4, pm: 3, initiative: 15 },
    resistances: { neutral: 0, earth: 10, fire: -15, water: 0, air: 5 },
    drops: [
      { resource_id: 2503, resource_name: "Toile d'Araignée", rate: "65%" }
    ],
    zones: ["Forêt d'Astrub", "Mines"]
  },
  {
    ankama_id: 3012,
    name: "Bwork",
    description: "Un gobelin vert massif et stupide.",
    race: "humanoïde",
    level_min: 35,
    level_max: 50,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3012.png",
    stats: { hp: 250, pa: 6, pm: 3, initiative: 10 },
    resistances: { neutral: 5, earth: 10, fire: 0, water: 0, air: -10 },
    drops: [
      { resource_id: 2007, resource_name: "Peau de Bwork", rate: "30%" },
      { resource_id: 2605, resource_name: "Écorce de Bwork", rate: "15%" }
    ],
    zones: ["Campement des Bworks"]
  },
  {
    ankama_id: 3013,
    name: "Blop",
    description: "Une gelée colorée et rebondissante.",
    race: "créature",
    level_min: 45,
    level_max: 55,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3013.png",
    stats: { hp: 150, pa: 4, pm: 3, initiative: 25 },
    resistances: { neutral: 0, earth: 0, fire: 20, water: 20, air: 0 },
    drops: [
      { resource_id: 2009, resource_name: "Peau de Blop", rate: "40%" },
      { resource_id: 2606, resource_name: "Graine de Blop", rate: "25%" }
    ],
    zones: ["Bord de la Forêt des Blops"]
  },
  {
    ankama_id: 3014,
    name: "Kwak",
    description: "Un canard qui maîtrise les éléments.",
    race: "oiseau",
    level_min: 30,
    level_max: 40,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3014.png",
    stats: { hp: 110, pa: 4, pm: 4, initiative: 40 },
    resistances: { neutral: 0, earth: 0, fire: 15, water: 15, air: 15 },
    drops: [
      { resource_id: 2102, resource_name: "Plume de Kwak", rate: "45%" }
    ],
    zones: ["Territoire des Kwaks"]
  },
  {
    ankama_id: 3015,
    name: "Abraknyde",
    description: "Un arbre vivant et protecteur.",
    race: "créature",
    level_min: 55,
    level_max: 70,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3015.png",
    stats: { hp: 300, pa: 5, pm: 2, initiative: 5 },
    resistances: { neutral: 5, earth: 25, fire: -20, water: 10, air: 0 },
    drops: [
      { resource_id: 2202, resource_name: "If", rate: "20%" },
      { resource_id: 2506, resource_name: "Toile d'Abraknyde", rate: "10%" }
    ],
    zones: ["Forêt des Abraknydes"]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // BOSSES & MONSTRES RARES (10 monstres)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 3016,
    name: "Bouftou Royal",
    description: "Le roi des bouftous. Majestueux et dangereux.",
    race: "créature",
    level_min: 30,
    level_max: 40,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3016.png",
    stats: { hp: 500, pa: 6, pm: 4, initiative: 30 },
    resistances: { neutral: 15, earth: 10, fire: 0, water: 0, air: 10 },
    drops: [
      { resource_id: 2002, resource_name: "Laine de Bouftou Noir", rate: "80%" },
      { resource_id: 2001, resource_name: "Cuir de Bouftou", rate: "60%" }
    ],
    zones: ["Royalmouth"],
    is_boss: true
  },
  {
    ankama_id: 3017,
    name: "Tofu Royal",
    description: "Le roi doré des tofu. Un adversaire aérien redoutable.",
    race: "oiseau",
    level_min: 35,
    level_max: 45,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3017.png",
    stats: { hp: 400, pa: 6, pm: 5, initiative: 50 },
    resistances: { neutral: 10, earth: -10, fire: 15, water: 0, air: 25 },
    drops: [
      { resource_id: 2103, resource_name: "Plume de Tofu Royal", rate: "50%" },
      { resource_id: 2100, resource_name: "Plume de Tofu", rate: "100%" }
    ],
    zones: ["Nid des Tofus"],
    is_boss: true
  },
  {
    ankama_id: 3018,
    name: "Royalmouth",
    description: "Un Bouftou Royal géant. Le cauchemar des paysans.",
    race: "créature",
    level_min: 50,
    level_max: 60,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3018.png",
    stats: { hp: 1200, pa: 8, pm: 4, initiative: 40 },
    resistances: { neutral: 20, earth: 15, fire: 5, water: 5, air: 10 },
    drops: [
      { resource_id: 2000, resource_name: "Laine de Bouftou", rate: "100%" },
      { resource_id: 2001, resource_name: "Cuir de Bouftou", rate: "80%" }
    ],
    zones: ["Donjon des Bouftous"],
    is_boss: true
  },
  {
    ankama_id: 3019,
    name: "Chafer Lancier",
    description: "Un squelette guerrier avec une lance.",
    race: "mort-vivant",
    level_min: 25,
    level_max: 40,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3019.png",
    stats: { hp: 180, pa: 6, pm: 3, initiative: 20 },
    resistances: { neutral: 10, earth: 15, fire: -25, water: 0, air: 5 },
    drops: [
      { resource_id: 2501, resource_name: "Os de Chafer", rate: "40%" }
    ],
    zones: ["Cimetière", "Donjon des Chafers"]
  },
  {
    ankama_id: 3020,
    name: "Dark Vlad",
    description: "Un vampyre millénaire. Un des boss les plus redoutés.",
    race: "mort-vivant",
    level_min: 200,
    level_max: 200,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3020.png",
    stats: { hp: 8000, pa: 10, pm: 5, initiative: 100 },
    resistances: { neutral: 30, earth: 20, fire: 50, water: -20, air: 20 },
    drops: [],
    zones: ["Tour de Dark Vlad"],
    is_boss: true
  },
  {
    ankama_id: 3021,
    name: "Crocabulia",
    description: "Un dragon aquatique terrifiant.",
    race: "créature",
    level_min: 100,
    level_max: 120,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3021.png",
    stats: { hp: 3500, pa: 9, pm: 4, initiative: 60 },
    resistances: { neutral: 25, earth: 10, fire: -10, water: 50, air: 10 },
    drops: [
      { resource_id: 2604, resource_name: "Pierre de Cristal", rate: "30%" }
    ],
    zones: ["Antre de Crocabulia"],
    is_boss: true
  },
  {
    ankama_id: 3022,
    name: "Blop Royal",
    description: "Le roi des gelées multicolores.",
    race: "créature",
    level_min: 60,
    level_max: 80,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3022.png",
    stats: { hp: 800, pa: 7, pm: 4, initiative: 35 },
    resistances: { neutral: 10, earth: 20, fire: 30, water: 30, air: 20 },
    drops: [
      { resource_id: 2009, resource_name: "Peau de Blop", rate: "60%" },
      { resource_id: 2606, resource_name: "Graine de Blop", rate: "40%" }
    ],
    zones: ["Forêt des Blops"],
    is_boss: true
  },
  {
    ankama_id: 3023,
    name: "Ougah",
    description: "Un Ouginak ancestral très puissant.",
    race: "humanoïde",
    level_min: 80,
    level_max: 100,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3023.png",
    stats: { hp: 1500, pa: 8, pm: 4, initiative: 45 },
    resistances: { neutral: 20, earth: 15, fire: 10, water: 0, air: 10 },
    drops: [],
    zones: ["Village d'Ougah"],
    is_boss: true
  },
  {
    ankama_id: 3024,
    name: "Moskito Royal",
    description: "Le roi des moustiques. Enorme et dangereux.",
    race: "insecte",
    level_min: 20,
    level_max: 30,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3024.png",
    stats: { hp: 200, pa: 5, pm: 6, initiative: 60 },
    resistances: { neutral: 0, earth: 0, fire: 0, water: 0, air: 20 },
    drops: [
      { resource_id: 2101, resource_name: "Aile de Moskito", rate: "70%" }
    ],
    zones: ["Forêt des Abraknydes"],
    is_boss: true
  },
  {
    ankama_id: 3025,
    name: "Corbac",
    description: "Un corbeau géant noir.",
    race: "oiseau",
    level_min: 55,
    level_max: 70,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3025.png",
    stats: { hp: 220, pa: 5, pm: 4, initiative: 55 },
    resistances: { neutral: 0, earth: 0, fire: 0, water: -10, air: 20 },
    drops: [
      { resource_id: 2107, resource_name: "Aile de Corbac", rate: "35%" }
    ],
    zones: ["Vallée des Corbac"]
  },
  {
    ankama_id: 3026,
    name: "Mulou",
    description: "Un loup noir féroce.",
    race: "créature",
    level_min: 40,
    level_max: 55,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3026.png",
    stats: { hp: 280, pa: 6, pm: 4, initiative: 40 },
    resistances: { neutral: 10, earth: 10, fire: -5, water: 0, air: 10 },
    drops: [
      { resource_id: 2003, resource_name: "Peau de Sanglier", rate: "30%" }
    ],
    zones: ["Forêt des Abraknydes"]
  },
  {
    ankama_id: 3027,
    name: "Maître des Chafers",
    description: "Le chef de tous les chafers.",
    race: "mort-vivant",
    level_min: 60,
    level_max: 80,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3027.png",
    stats: { hp: 800, pa: 7, pm: 4, initiative: 30 },
    resistances: { neutral: 15, earth: 20, fire: -30, water: 0, air: 10 },
    drops: [
      { resource_id: 2501, resource_name: "Os de Chafer", rate: "50%" }
    ],
    zones: ["Donjon des Chafers"],
    is_boss: true
  },
  {
    ankama_id: 3028,
    name: "Wobot",
    description: "Un lapin robotique.",
    race: "créature",
    level_min: 45,
    level_max: 60,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3028.png",
    stats: { hp: 350, pa: 6, pm: 4, initiative: 35 },
    resistances: { neutral: 10, earth: 0, fire: 0, water: 0, air: 5 },
    drops: [
      { resource_id: 2005, resource_name: "Cuir de Wabbit", rate: "25%" }
    ],
    zones: ["Île de Wabbit"]
  },
  {
    ankama_id: 3029,
    name: "Glours",
    description: "Un ours des cavernes géant.",
    race: "créature",
    level_min: 90,
    level_max: 110,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3029.png",
    stats: { hp: 2000, pa: 8, pm: 3, initiative: 15 },
    resistances: { neutral: 20, earth: 30, fire: 0, water: 0, air: -10 },
    drops: [],
    zones: ["Cavernes des Glours"],
    is_boss: true
  },
  {
    ankama_id: 3030,
    name: "Corailleur",
    description: "Un guerrier des fonds marins.",
    race: "humanoïde",
    level_min: 70,
    level_max: 85,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3030.png",
    stats: { hp: 600, pa: 7, pm: 4, initiative: 25 },
    resistances: { neutral: 10, earth: -10, fire: -20, water: 40, air: 0 },
    drops: [],
    zones: ["Fonds Marins"]
  },
  {
    ankama_id: 3031,
    name: "Racaille",
    description: "Un bandit de grand chemin.",
    race: "humanoïde",
    level_min: 50,
    level_max: 65,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3031.png",
    stats: { hp: 450, pa: 6, pm: 4, initiative: 30 },
    resistances: { neutral: 5, earth: 0, fire: 0, water: 0, air: 10 },
    drops: [],
    zones: ["Routes d'Amakna"]
  },
  {
    ankama_id: 3032,
    name: "Abrakleur Clair",
    description: "Un arakne magique lumineux.",
    race: "insecte",
    level_min: 75,
    level_max: 90,
    image_url: "https://static.ankama.com/dofus/www/game/monsters/200/3032.png",
    stats: { hp: 480, pa: 6, pm: 3, initiative: 35 },
    resistances: { neutral: 5, earth: 15, fire: -15, water: 15, air: 0 },
    drops: [
      { resource_id: 2604, resource_name: "Pierre de Cristal", rate: "15%" }
    ],
    zones: ["Forêt des Abraknydes"]
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PANOPLIES (SETS)
// ═══════════════════════════════════════════════════════════════════════════════

const setsData: Omit<Set, 'id' | 'created_at'>[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // PANOPLIES BASIQUES (6 sets)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 4000,
    name: "Panoplie du Bouftou",
    level: 10,
    image_url: "https://static.ankama.com/dofus/www/game/sets/200/4000.png",
    items: [201, 401, 601, 502],
    bonuses: [
      { items_count: 2, stats: { vitality: 10, strength: 5 } },
      { items_count: 4, stats: { vitality: 20, strength: 10, wisdom: 5 } }
    ]
  },
  {
    ankama_id: 4001,
    name: "Panoplie du Chef de Guerre",
    level: 35,
    image_url: "https://static.ankama.com/dofus/www/game/sets/200/4001.png",
    items: [101, 201, 202, 502, 401],
    bonuses: [
      { items_count: 2, stats: { strength: 10 } },
      { items_count: 3, stats: { strength: 20, vitality: 20 } },
      { items_count: 5, stats: { strength: 30, vitality: 30, wisdom: 10 } }
    ]
  },
  {
    ankama_id: 4002,
    name: "Panoplie du Tofu",
    level: 25,
    image_url: "https://static.ankama.com/dofus/www/game/sets/200/4002.png",
    items: [205, 305, 405, 505, 603],
    bonuses: [
      { items_count: 2, stats: { agility: 10 } },
      { items_count: 4, stats: { agility: 20, air_dmg: 5 } },
      { items_count: 5, stats: { agility: 30, air_dmg: 10, pm: 1 } }
    ]
  },
  {
    ankama_id: 4003,
    name: "Panoplie du Wabbit",
    level: 40,
    image_url: "https://static.ankama.com/dofus/www/game/sets/200/4003.png",
    items: [204, 304, 403, 503, 602],
    bonuses: [
      { items_count: 2, stats: { agility: 15 } },
      { items_count: 3, stats: { agility: 25, vitality: 15 } },
      { items_count: 5, stats: { agility: 40, vitality: 30, pm: 1, initiative: 30 } }
    ]
  },
  {
    ankama_id: 4004,
    name: "Panoplie du Moskito",
    level: 20,
    image_url: "https://static.ankama.com/dofus/www/game/sets/200/4004.png",
    items: [206, 306, 206],
    bonuses: [
      { items_count: 2, stats: { agility: 10, initiative: 15 } },
      { items_count: 3, stats: { agility: 20, initiative: 30, pm: 1 } }
    ]
  },
  {
    ankama_id: 4005,
    name: "Panoplie du Chafer",
    level: 45,
    image_url: "https://static.ankama.com/dofus/www/game/sets/200/4005.png",
    items: [105, 207, 407, 507, 606],
    bonuses: [
      { items_count: 2, stats: { intelligence: 15 } },
      { items_count: 4, stats: { intelligence: 30, fire_dmg: 8 } },
      { items_count: 5, stats: { intelligence: 45, fire_dmg: 15, initiative: 20 } }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PANOPLIES INTERMÉDIAIRES (6 sets)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    ankama_id: 4006,
    name: "Panoplie du Prespic",
    level: 50,
    image_url: "https://static.ankama.com/dofus/www/game/sets/200/4006.png",
    items: [104, 304, 404, 504, 604],
    bonuses: [
      { items_count: 2, stats: { agility: 15, crit: 2 } },
      { items_count: 3, stats: { agility: 30, crit: 4 } },
      { items_count: 5, stats: { agility: 50, crit: 8, initiative: 40, air_res: 5 } }
    ]
  },
  {
    ankama_id: 4007,
    name: "Panoplie du Blop",
    level: 60,
    image_url: "https://static.ankama.com/dofus/www/game/sets/200/4007.png",
    items: [203, 406, 506, 605],
    bonuses: [
      { items_count: 2, stats: { vitality: 20, wisdom: 10 } },
      { items_count: 3, stats: { vitality: 40, wisdom: 20, prospecting: 15 } },
      { items_count: 4, stats: { vitality: 60, wisdom: 30, prospecting: 25, summons: 1 } }
    ]
  },
  {
    ankama_id: 4008,
    name: "Panoplie du Bwork",
    level: 85,
    image_url: "https://static.ankama.com/dofus/www/game/sets/200/4008.png",
    items: [106, 308, 409, 508, 607],
    bonuses: [
      { items_count: 2, stats: { strength: 25, vitality: 25 } },
      { items_count: 3, stats: { strength: 50, vitality: 50, pods: 50 } },
      { items_count: 5, stats: { strength: 80, vitality: 80, pods: 150, earth_res: 10 } }
    ]
  },
  {
    ankama_id: 4009,
    name: "Panoplie Akwadala",
    level: 90,
    image_url: "https://static.ankama.com/dofus/www/game/sets/200/4009.png",
    items: [108, 208, 306, 408, 608],
    bonuses: [
      { items_count: 2, stats: { chance: 25 } },
      { items_count: 3, stats: { chance: 50, water_dmg: 8 } },
      { items_count: 5, stats: { chance: 80, water_dmg: 20, pa: 1, water_res: 10 } }
    ]
  },
  {
    ankama_id: 4010,
    name: "Panoplie Terrdala",
    level: 95,
    image_url: "https://static.ankama.com/dofus/www/game/sets/200/4010.png",
    items: [106, 308, 409, 508, 607],
    bonuses: [
      { items_count: 2, stats: { strength: 25, vitality: 30 } },
      { items_count: 3, stats: { strength: 50, vitality: 60, earth_dmg: 8 } },
      { items_count: 5, stats: { strength: 80, vitality: 100, earth_dmg: 20, earth_res: 15 } }
    ]
  },
  {
    ankama_id: 4011,
    name: "Panoplie du Chêne Mou",
    level: 115,
    image_url: "https://static.ankama.com/dofus/www/game/sets/200/4011.png",
    items: [109, 309, 409, 508, 609],
    bonuses: [
      { items_count: 2, stats: { vitality: 40, wisdom: 15 } },
      { items_count: 3, stats: { vitality: 80, wisdom: 30, earth_res: 10 } },
      { items_count: 5, stats: { vitality: 150, wisdom: 50, earth_res: 25, heals: 15 } }
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// FONCTION DE SEEDING
// ═══════════════════════════════════════════════════════════════════════════════

export async function seedDatabase(): Promise<void> {
  console.log('🌱 Dofus Retro API - Seeding database...');
  console.log('');

  // Insert items
  let itemsCount = 0;
  for (const item of itemsData) {
    try {
      await run(
        `INSERT OR IGNORE INTO items (ankama_id, name, description, type, level, image_url, conditions, stats, set_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.ankama_id,
          item.name,
          item.description || null,
          item.type,
          item.level,
          item.image_url || null,
          item.conditions ? JSON.stringify(item.conditions) : null,
          item.stats ? JSON.stringify(item.stats) : null,
          item.set_id || null
        ]
      );
      itemsCount++;
    } catch (err) {
      console.error(`❌ Erreur insertion item ${item.name}:`, err);
    }
  }
  console.log(`✅ Items: ${itemsCount}/${itemsData.length} insérés`);

  // Insert weapons
  let weaponsCount = 0;
  for (const weapon of weaponsData) {
    try {
      await run(
        `INSERT OR IGNORE INTO weapons (ankama_id, name, description, type, level, image_url, conditions, stats, 
          ap_cost, uses_per_turn, range_min, range_max, crit_chance, crit_bonus, base_damage, set_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          weapon.ankama_id,
          weapon.name,
          weapon.description || null,
          weapon.type,
          weapon.level,
          weapon.image_url || null,
          weapon.conditions ? JSON.stringify(weapon.conditions) : null,
          weapon.stats ? JSON.stringify(weapon.stats) : null,
          weapon.ap_cost,
          weapon.uses_per_turn,
          weapon.range_min,
          weapon.range_max,
          weapon.crit_chance,
          weapon.crit_bonus,
          weapon.base_damage ? JSON.stringify(weapon.base_damage) : null,
          weapon.set_id || null
        ]
      );
      weaponsCount++;
    } catch (err) {
      console.error(`❌ Erreur insertion weapon ${weapon.name}:`, err);
    }
  }
  console.log(`✅ Weapons: ${weaponsCount}/${weaponsData.length} insérés`);

  // Insert resources
  let resourcesCount = 0;
  for (const resource of resourcesData) {
    try {
      await run(
        `INSERT OR IGNORE INTO resources (ankama_id, name, description, type, level, image_url, drop_from, craft_usage) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          resource.ankama_id,
          resource.name,
          resource.description || null,
          resource.type,
          resource.level || null,
          resource.image_url || null,
          resource.drop_from ? JSON.stringify(resource.drop_from) : null,
          resource.craft_usage ? JSON.stringify(resource.craft_usage) : null
        ]
      );
      resourcesCount++;
    } catch (err) {
      console.error(`❌ Erreur insertion resource ${resource.name}:`, err);
    }
  }
  console.log(`✅ Resources: ${resourcesCount}/${resourcesData.length} insérées`);

  // Insert monsters
  let monstersCount = 0;
  for (const monster of monstersData) {
    try {
      await run(
        `INSERT OR IGNORE INTO monsters (ankama_id, name, description, race, level_min, level_max, image_url, 
          stats, resistances, drops, zones, is_boss, is_archmonster) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          monster.ankama_id,
          monster.name,
          monster.description || null,
          monster.race || null,
          monster.level_min,
          monster.level_max,
          monster.image_url || null,
          monster.stats ? JSON.stringify(monster.stats) : null,
          monster.resistances ? JSON.stringify(monster.resistances) : null,
          monster.drops ? JSON.stringify(monster.drops) : null,
          monster.zones ? JSON.stringify(monster.zones) : null,
          monster.is_boss ? 1 : 0,
          monster.is_archmonster ? 1 : 0
        ]
      );
      monstersCount++;
    } catch (err) {
      console.error(`❌ Erreur insertion monster ${monster.name}:`, err);
    }
  }
  console.log(`✅ Monsters: ${monstersCount}/${monstersData.length} insérés`);

  // Insert sets
  let setsCount = 0;
  for (const set of setsData) {
    try {
      await run(
        `INSERT OR IGNORE INTO sets (ankama_id, name, level, image_url, items, bonuses) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          set.ankama_id,
          set.name,
          set.level || null,
          set.image_url || null,
          set.items ? JSON.stringify(set.items) : null,
          set.bonuses ? JSON.stringify(set.bonuses) : null
        ]
      );
      setsCount++;
    } catch (err) {
      console.error(`❌ Erreur insertion set ${set.name}:`, err);
    }
  }
  console.log(`✅ Sets: ${setsCount}/${setsData.length} insérés`);

  console.log('');
  console.log('🎉 Seeding terminé avec succès !');
  console.log('');
  console.log('📊 Récapitulatif:');
  console.log(`   • Items: ${itemsCount}`);
  console.log(`   • Weapons: ${weaponsCount}`);
  console.log(`   • Resources: ${resourcesCount}`);
  console.log(`   • Monsters: ${monstersCount}`);
  console.log(`   • Sets: ${setsCount}`);
  console.log(`   • TOTAL: ${itemsCount + weaponsCount + resourcesCount + monstersCount + setsCount} entrées`);
}
