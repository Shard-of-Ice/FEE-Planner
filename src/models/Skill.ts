import { CharacterStats, WeaponStats } from './StatBlock';

export class Skill {
  name: string;
  id: string;
  description: string;
  spCost: number;

  characterBonus: CharacterStats;
  weaponBonus: WeaponStats;

  constructor(
    name: string,
    id: string,
    description: string,
    spCost: number,
    characterBonus: CharacterStats,
    weaponBonus: WeaponStats
  ) {
    this.name = name;
    this.id = id;
    this.description = description;
    this.spCost = spCost;
    this.characterBonus = characterBonus;
    this.weaponBonus = weaponBonus;
  }

  get learnable() {
    return this.spCost > 0;
  }
}
