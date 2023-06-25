import { WeaponStats } from './StatBlock';

export class Weapon {
  data: WeaponData | null;
  forgingLevel: number;
  engraving: Engraving | null;

  constructor(
    data: WeaponData | null = null,
    forgingLevel = 0,
    engraving: Engraving | null = null
  ) {
    this.data = data;
    this.forgingLevel = forgingLevel;
    this.engraving = engraving;
  }

  private get forgingUpgrade(): ForgingUpgrade | null {
    return this.data?.forgingUpgrades[this.forgingLevel] || null;
  }

  get stats(): WeaponStats {
    if (!this.data) {
      return new WeaponStats();
    }

    return WeaponStats.add(
      WeaponStats.add(
        this.data.stats,
        this.forgingUpgrade?.stats || new WeaponStats()
      ),
      this.engraving?.stats || new WeaponStats()
    );
  }
}

export class WeaponData {
  id: string;
  name: string;
  type: WeaponType;
  stats: WeaponStats;
  rank: ProficiencyLevel;
  isPlayable = false;
  exclusiveCharacterName: string;
  forgingUpgrades: ForgingUpgrade[];

  constructor(
    id: string,
    name: string,
    type: WeaponType,
    stats: WeaponStats,
    rank: ProficiencyLevel,
    isPlayable: boolean,
    exclusiveCharacterName: string,
    forgingUpgrades: ForgingUpgrade[]
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.stats = stats;
    this.rank = rank;
    this.isPlayable = isPlayable;
    this.exclusiveCharacterName = exclusiveCharacterName;
    this.forgingUpgrades = forgingUpgrades;
  }
}

export class WeaponType {
  static Sword = new WeaponType('Sword');
  static Lance = new WeaponType('Lance');
  static Axe = new WeaponType('Axe');
  static Bow = new WeaponType('Bow');
  static Dagger = new WeaponType('Dagger');
  static Tome = new WeaponType('Tome');
  static Staff = new WeaponType('Staff');
  static Arts = new WeaponType('Arts');
  static Special = new WeaponType('Special');
  static None = new WeaponType('None');

  static all: WeaponType[] = [
    WeaponType.Sword,
    WeaponType.Lance,
    WeaponType.Axe,
    WeaponType.Bow,
    WeaponType.Dagger,
    WeaponType.Tome,
    WeaponType.Staff,
    WeaponType.Arts,
    WeaponType.Special,
  ];

  readonly name: string;
  private constructor(name: string) {
    this.name = name;
  }

  static fromString(str: string): WeaponType {
    for (const type of WeaponType.all) {
      if (type.name == str) {
        return type;
      }
    }
    // default, we log a warning if the value is not a reasonable representation of None
    if (str != '---') {
      console.warn('Unknown weapon type ' + str);
    }
    return WeaponType.None;
  }

  equals(other: WeaponType): boolean {
    return this.name == other.name;
  }
}

export interface WeaponProficiency {
  weaponType: WeaponType;
  level: ProficiencyLevel;
}

export class ProficiencyLevel {
  static D = new ProficiencyLevel('D', 1);
  static Dplus = new ProficiencyLevel('D+', 2);
  static C = new ProficiencyLevel('C', 3);
  static Cplus = new ProficiencyLevel('C+', 4);
  static B = new ProficiencyLevel('B', 5);
  static Bplus = new ProficiencyLevel('B+', 6);
  static A = new ProficiencyLevel('A', 7);
  static Aplus = new ProficiencyLevel('A+', 8);
  static S = new ProficiencyLevel('S', 9);
  static None = new ProficiencyLevel('None', 0);

  static all: ProficiencyLevel[] = [
    ProficiencyLevel.D,
    ProficiencyLevel.Dplus,
    ProficiencyLevel.C,
    ProficiencyLevel.Cplus,
    ProficiencyLevel.B,
    ProficiencyLevel.Bplus,
    ProficiencyLevel.A,
    ProficiencyLevel.Aplus,
    ProficiencyLevel.S,
  ];

  readonly fullName: string;
  readonly value: number;
  private constructor(fullName: string, value: number) {
    this.fullName = fullName;
    this.value = value;
  }

  get shortName(): string {
    // The "+" should not be displayed, as it only indicates
    // whether the level can be increased through innate proficiencies
    return this.fullName[0];
  }

  get canBeIncreased(): boolean {
    // Only levels with "+" can be increased through innate proficiencies
    return this.fullName.length === 2;
  }

  static fromString(str: string): ProficiencyLevel {
    for (const type of ProficiencyLevel.all) {
      if (type.fullName == str) {
        return type;
      }
    }
    // default, we log a warning if the value is not a reasonable representation of None
    if (str != '-') {
      console.warn('Unknown proficiency level ' + str);
    }
    return ProficiencyLevel.None;
  }

  equals(other: ProficiencyLevel) {
    return this.value === other.value;
  }

  greaterOrEqualTo(other: ProficiencyLevel) {
    return this.value >= other.value;
  }

  getHigherLevel(): ProficiencyLevel {
    return (
      ProficiencyLevel.all.find((pl) => pl.value === this.value + 1) ||
      ProficiencyLevel.None
    );
  }
}

export class ForgingUpgrade {
  level: number;
  stats: WeaponStats;

  constructor(level: number, stats: WeaponStats) {
    this.level = level;
    this.stats = stats;
  }
}

export class Engraving {
  emblemName: string;
  stats: WeaponStats;

  constructor(emblemName: string, stats: WeaponStats) {
    this.emblemName = emblemName;
    this.stats = stats;
  }
}
