export interface Item {
  id?: number;
  ankama_id?: number;
  name: string;
  description?: string;
  type: ItemType;
  level: number;
  image_url?: string;
  conditions?: string[];
  stats?: ItemStats;
  set_id?: number;
  created_at?: string;
}

export type ItemType = 
  | 'amulette' | 'anneau' | 'bottes' | 'bouclier' | 'cape' | 'ceinture' | 'chapeau'
  | 'sac' | 'dofus'
  | 'resource' | 'consommable';

export interface ItemStats {
  vitality?: number | string;
  wisdom?: number | string;
  strength?: number | string;
  intelligence?: number | string;
  chance?: number | string;
  agility?: number | string;
  initiative?: number | string;
  range?: number | string;
  summons?: number | string;
  prospecting?: number | string;
  pods?: number | string;
  pa?: number | string;
  pm?: number | string;
  crit?: number | string;
  // Résistances
  neutral_res?: number | string;
  earth_res?: number | string;
  fire_res?: number | string;
  water_res?: number | string;
  air_res?: number | string;
  // Dommages
  neutral_dmg?: number | string;
  earth_dmg?: number | string;
  fire_dmg?: number | string;
  water_dmg?: number | string;
  air_dmg?: number | string;
  // Autres
  heals?: number | string;
  trap_power?: number | string;
  trap_res?: number | string;
  [key: string]: any;
}

export interface Weapon extends Item {
  ap_cost: number;
  uses_per_turn: number;
  range_min: number;
  range_max: number;
  crit_chance: number;
  crit_bonus: number;
  base_damage: DamageRange;
}

export interface DamageRange {
  neutral?: string; // "10-15"
  earth?: string;
  fire?: string;
  water?: string;
  air?: string;
  heals?: string;
}

export interface Resource {
  id?: number;
  ankama_id?: number;
  name: string;
  description?: string;
  type: ResourceType;
  level?: number;
  image_url?: string;
  drop_from?: DropSource[];
  craft_usage?: CraftUsage[];
  created_at?: string;
}

export type ResourceType =
  | 'plume' | 'cuir' | 'peau' | 'laine' | 'graine' | 'fleur' | 'feuille'
  | 'bois' | 'minerai' | 'pierre' | 'os' | 'carcasse' | 'toile'
  | 'huile' | 'poudre' | 'potion' | 'ressource_diverse';

export interface DropSource {
  monster_id: number;
  monster_name: string;
  drop_rate: string; // "0.1%", "10%", "100%"
}

export interface CraftUsage {
  item_id: number;
  item_name: string;
  quantity: number;
}

export interface Monster {
  id?: number;
  ankama_id?: number;
  name: string;
  description?: string;
  race?: string;
  level_min: number;
  level_max: number;
  image_url?: string;
  stats?: MonsterStats;
  resistances?: Resistances;
  drops?: MonsterDrop[];
  zones?: string[];
  is_boss?: boolean;
  is_archmonster?: boolean;
  created_at?: string;
}

export interface MonsterStats {
  hp?: number;
  pa?: number;
  pm?: number;
  initiative?: number;
}

export interface Resistances {
  neutral?: number;
  earth?: number;
  fire?: number;
  water?: number;
  air?: number;
}

export interface MonsterDrop {
  resource_id: number;
  resource_name: string;
  rate: string;
}

export interface Set {
  id?: number;
  ankama_id?: number;
  name: string;
  level?: number;
  image_url?: string;
  items?: number[];
  bonuses?: SetBonus[];
  created_at?: string;
}

export interface SetBonus {
  items_count: number; // 2, 3, 4...
  stats: Partial<ItemStats>;
}

export interface Recipe {
  id?: number;
  result_item_id: number;
  result_quantity?: number;
  job?: string;
  level_required?: number;
  ingredients?: RecipeIngredient[];
  created_at?: string;
}

export interface RecipeIngredient {
  item_id: number;
  quantity: number;
}
