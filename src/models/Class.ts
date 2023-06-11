import { StatBlock } from './StatBlock';
import { WeaponProficiency } from './Weapon';

export class ClassTier {
  static Base = new ClassTier('Base');
  static Advanced = new ClassTier('Advanced');
  static Special = new ClassTier('Special');
  static None = new ClassTier('None');

  static all: ClassTier[] = [
    ClassTier.Base,
    ClassTier.Advanced,
    ClassTier.Special,
  ];

  readonly name: string;
  private constructor(name: string) {
    this.name = name;
  }

  static fromString(str: string): ClassTier {
    for (const type of ClassTier.all) {
      if (type.name == str) {
        return type;
      }
    }
    // default
    console.warn('Unknown class tier ' + str);
    return ClassTier.None;
  }

  equals(other: ClassTier): boolean {
    return this.name == other.name;
  }

  get maxLevel(): number {
    if (this.equals(ClassTier.Special)) {
      return 40;
    } else {
      return 20;
    }
  }

  get promotionLevel(): number {
    if (this.equals(ClassTier.Special)) {
      return 21;
    } else {
      return 10;
    }
  }
}

export class ClassType {
  static Dragon = new ClassType('Dragon');
  static Cavalry = new ClassType('Cavalry');
  static Mystical = new ClassType('Mystical');
  static Backup = new ClassType('Backup');
  static Covert = new ClassType('Covert');
  static Flying = new ClassType('Flying');
  static Armor = new ClassType('Armor');
  static QiAdept = new ClassType('Qi Adept');
  static None = new ClassType('None');

  static all: ClassType[] = [
    ClassType.Dragon,
    ClassType.Cavalry,
    ClassType.Mystical,
    ClassType.Backup,
    ClassType.Covert,
    ClassType.Flying,
    ClassType.Armor,
    ClassType.QiAdept,
  ];

  readonly name: string;
  private constructor(name: string) {
    this.name = name;
  }

  static fromString(str: string): ClassType {
    for (const type of ClassType.all) {
      if (type.name == str) {
        return type;
      }
    }
    // default
    console.warn('Unknown class type ' + str);
    return ClassType.None;
  }

  equals(other: ClassType): boolean {
    return this.name == other.name;
  }
}

export class Class {
  id: string;
  name: string;
  tier: ClassTier;
  type: ClassType;
  bases: StatBlock;
  growths: StatBlock;
  caps: StatBlock;
  weaponProficiencies: WeaponProficiency[];
  isPlayable: boolean;
  femaleOnly: boolean;
  exclusiveCharacterName: string;

  constructor(
    id: string,
    name: string,
    tier: ClassTier,
    type: ClassType,
    bases: StatBlock,
    growths: StatBlock,
    caps: StatBlock,
    weaponProficiencies: WeaponProficiency[],
    isPlayable: boolean,
    femaleOnly: boolean,
    exclusiveCharacterName: string
  ) {
    this.id = id;
    this.name = name;
    this.tier = tier;
    this.type = type;
    this.bases = bases;
    this.growths = growths;
    this.caps = caps;
    this.weaponProficiencies = weaponProficiencies;
    this.isPlayable = isPlayable;
    this.femaleOnly = femaleOnly;
    this.exclusiveCharacterName = exclusiveCharacterName;
  }
}
