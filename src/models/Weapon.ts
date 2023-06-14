export class Weapon {
  data: WeaponData;
  forgingLevel: number;
  engraving: Engraving | null;

  constructor(
    data: WeaponData,
    forgingLevel: number,
    engraving: Engraving | null = null
  ) {
    this.data = data;
    this.forgingLevel = forgingLevel;
    this.engraving = engraving;
  }

  private get forgingUpgrade(): ForgingUpgrade {
    return this.data.forgingUpgrades[this.forgingLevel];
  }

  get might(): number {
    return (
      this.data.might + this.forgingUpgrade.might + (this.engraving?.might || 0)
    );
  }

  get hit(): number {
    return this.data.hit + this.forgingUpgrade.hit + (this.engraving?.hit || 0);
  }

  get critical(): number {
    return (
      this.data.critical +
      this.forgingUpgrade.critical +
      (this.engraving?.critical || 0)
    );
  }

  get weight(): number {
    return (
      this.data.weight +
      this.forgingUpgrade.weight +
      (this.engraving?.weight || 0)
    );
  }

  get avoid(): number {
    return this.data.avoid + (this.engraving?.avoid || 0);
  }

  get dodge(): number {
    return this.data.dodge + (this.engraving?.dodge || 0);
  }
}

export class WeaponData {
  id: string;
  name: string;
  type: WeaponType;
  might: number;
  hit: number;
  critical: number;
  weight: number;
  avoid: number;
  dodge: number;
  rank: ProficiencyLevel;
  isPlayable = false;
  exclusiveCharacterName: string;
  forgingUpgrades: ForgingUpgrade[];

  constructor(
    id: string,
    name: string,
    type: WeaponType,
    might: number,
    hit: number,
    critical: number,
    weight: number,
    avoid: number,
    dodge: number,
    rank: ProficiencyLevel,
    isPlayable: boolean,
    exclusiveCharacterName: string,
    forgingUpgrades: ForgingUpgrade[]
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.might = might;
    this.hit = hit;
    this.critical = critical;
    this.weight = weight;
    this.avoid = avoid;
    this.dodge = dodge;
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
    // default
    console.warn('Unknown weapon type ' + str);
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

  readonly name: string;
  readonly value: number;
  private constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }

  static fromString(str: string): ProficiencyLevel {
    for (const type of ProficiencyLevel.all) {
      if (type.name == str) {
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
}

export class ForgingUpgrade {
  level: number;
  might: number;
  weight: number;
  hit: number;
  critical: number;

  constructor(
    level: number,
    might: number,
    weight: number,
    hit: number,
    critical: number
  ) {
    this.level = level;
    this.might = might;
    this.weight = weight;
    this.hit = hit;
    this.critical = critical;
  }
}

export class Engraving {
  name: string;
  might: number;
  hit: number;
  critical: number;
  avoid: number;
  dodge: number;

  constructor(
    name: string,
    might: number,
    weight: number,
    hit: number,
    critical: number,
    avoid: number,
    dodge: number
  ) {
    this.name = name;
    this.might = might;
    this.weight = weight;
    this.hit = hit;
    this.critical = critical;
    this.avoid = avoid;
    this.dodge = dodge;
  }
  weight: number;
}
