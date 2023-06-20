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

export class SyncedEmblem {
  emblem: Emblem | null;
  bondLevel: number;

  constructor(emblem: Emblem | null = null, bondLevel = 1) {
    this.emblem = emblem;
    this.bondLevel = bondLevel;
  }

  get bondLevelData(): BondLevel | null {
    return this.emblem?.bondLevels[this.bondLevel] || null;
  }
}
