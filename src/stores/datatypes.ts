export class StatBlock {
  hp: number;
  str: number;
  mag: number;
  dex: number;
  spd: number;
  def: number;
  res: number;
  lck: number;
  bld: number;
  mov: number;

  constructor(
    hp: number,
    str: number,
    mag: number,
    dex: number,
    spd: number,
    def: number,
    res: number,
    lck: number,
    bld: number,
    mov: number
  ) {
    this.hp = hp;
    this.str = str;
    this.mag = mag;
    this.dex = dex;
    this.spd = spd;
    this.def = def;
    this.res = res;
    this.lck = lck;
    this.bld = bld;
    this.mov = mov;
  }

  static add(a: StatBlock, b: StatBlock): StatBlock {
    return new StatBlock(
      a.hp + b.hp,
      a.str + b.str,
      a.mag + b.mag,
      a.dex + b.dex,
      a.spd + b.spd,
      a.def + b.def,
      a.res + b.res,
      a.lck + b.lck,
      a.bld + b.bld,
      a.mov + b.mov
    );
  }

  static multiply(a: StatBlock, b: number): StatBlock {
    return new StatBlock(
      a.hp * b,
      a.str * b,
      a.mag * b,
      a.dex * b,
      a.spd * b,
      a.def * b,
      a.res * b,
      a.lck * b,
      a.bld * b,
      a.mov * b
    );
  }
}

export class ClassTier {
  static Base = new ClassTier('Base');
  static Advanced = new ClassTier('Advanced');
  static Special = new ClassTier('Special');

  readonly name: string;
  private constructor(name: string) {
    this.name = name;
  }

  equals(other: ClassTier): boolean {
    return this.name == other.name;
  }

  maxLevel(): number {
    if (this.equals(ClassTier.Special)) {
      return 40;
    } else {
      return 20;
    }
  }

  promotionLevel(): number {
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
  static QiAdept = new ClassType('QiAdept');

  readonly name: string;
  private constructor(name: string) {
    this.name = name;
  }

  equals(other: ClassType): boolean {
    return this.name == other.name;
  }
}

export interface Class {
  name: string;
  tier: ClassTier;
  type: ClassType;
  bases: StatBlock;
  growths: StatBlock;
}

export class Character {
  name: string;
  startingClass: Class;
  startingLevel: number;
  startingInternalLevel: number;
  bases: StatBlock;
  growths: StatBlock;

  constructor(
    name: string,
    startingClass: Class,
    startingLevel: number,
    startingInternalLevel: number,
    bases: StatBlock,
    growths: StatBlock
  ) {
    this.name = name;
    this.startingClass = startingClass;
    this.startingLevel = startingLevel;
    this.startingInternalLevel = startingInternalLevel;
    this.bases = bases;
    this.growths = growths;
  }

  getStartingTotalLevel(): number {
    return this.startingInternalLevel + this.startingLevel;
  }
}

export class Unit {
  character: Character;
  class: Class;
  level: number;

  constructor(character: Character) {
    this.character = character;
    this.class = character.startingClass;
    this.level = character.startingLevel;
  }

  getTotalBases(): StatBlock {
    return StatBlock.add(this.character.bases, this.class.bases);
  }

  getTotalGrowths(): StatBlock {
    return StatBlock.add(this.character.growths, this.class.growths);
  }

  getInternalLevel(): number {
    let internalLevel = this.character.startingInternalLevel;
    if (this.class != this.character.startingClass) {
      internalLevel += this.character.startingLevel;
      if (this.class.tier == ClassTier.Advanced) {
        internalLevel = Math.min(
          internalLevel,
          this.character.startingClass.tier.promotionLevel()
        );
      }
    }
    return internalLevel;
  }

  getTotalLevel(): number {
    return this.getInternalLevel() + this.level;
  }

  getStats(): StatBlock {
    let levelsStartingClass = 0;
    if (this.class.tier == ClassTier.Advanced) {
      levelsStartingClass = Math.max(
        0,
        this.character.startingClass.tier.promotionLevel() -
          this.character.startingLevel
      );
    }

    const startingClassGrowths = StatBlock.add(
      this.character.growths,
      this.class.growths
    );
    const startingClassGrowthsPoints = StatBlock.multiply(
      startingClassGrowths,
      levelsStartingClass
    );

    let levelsCurrentCLass = this.level;
    if (this.class == this.character.startingClass) {
      levelsCurrentCLass -= this.character.startingLevel;
    }

    const currentClassGrowthsPoints = StatBlock.multiply(
      this.getTotalGrowths(),
      levelsCurrentCLass
    );

    const totalGrowthsPoints = StatBlock.add(
      startingClassGrowthsPoints,
      currentClassGrowthsPoints
    );
    const currentStats = StatBlock.add(
      StatBlock.add(this.character.bases, this.class.bases),
      StatBlock.multiply(totalGrowthsPoints, 1 / 100)
    );

    return currentStats;
  }
}
