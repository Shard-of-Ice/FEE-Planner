import { CharacterStats } from './StatBlock';

export class Emblem {
  name: string;
  bondLevels: BondLevel[];

  constructor(name: string, bondLevels: BondLevel[] = []) {
    this.name = name;
    this.bondLevels = bondLevels;
  }
}

export class BondLevel {
  level: number;
  bonusStats: CharacterStats;

  constructor(level: number, bonusStats: CharacterStats) {
    this.level = level;
    this.bonusStats = bonusStats;
  }
}
