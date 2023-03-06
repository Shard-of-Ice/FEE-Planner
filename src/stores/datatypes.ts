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

  static make(stats: number[]) {
    return new StatBlock(
      stats[0],
      stats[1],
      stats[2],
      stats[3],
      stats[4],
      stats[5],
      stats[6],
      stats[7],
      stats[8],
      stats[9]
    );
  }

  static binaryOperator(
    a: StatBlock,
    b: StatBlock,
    operator: (a: number, b: number) => number
  ): StatBlock {
    return new StatBlock(
      operator(a.hp, b.hp),
      operator(a.str, b.str),
      operator(a.mag, b.mag),
      operator(a.dex, b.dex),
      operator(a.spd, b.spd),
      operator(a.def, b.def),
      operator(a.res, b.res),
      operator(a.lck, b.lck),
      operator(a.bld, b.bld),
      operator(a.mov, b.mov)
    );
  }

  static add(a: StatBlock, b: StatBlock): StatBlock {
    return StatBlock.binaryOperator(a, b, (a, b) => a + b);
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
    return ClassTier.None;
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
    return ClassType.None;
  }

  equals(other: ClassType): boolean {
    return this.name == other.name;
  }
}

export class Class {
  name: string;
  tier: ClassTier;
  type: ClassType;
  bases: StatBlock;
  growths: StatBlock;
  caps: StatBlock;

  constructor(
    name: string,
    tier: ClassTier,
    type: ClassType,
    bases: StatBlock,
    growths: StatBlock,
    caps: StatBlock
  ) {
    this.name = name;
    this.tier = tier;
    this.type = type;
    this.bases = bases;
    this.growths = growths;
    this.caps = caps;
  }
}

export class Character {
  name: string;
  startingClass: Class;
  startingLevel: number;
  startingInternalLevel: number;
  startingSP: number;
  bases: StatBlock;
  growths: StatBlock;
  caps: StatBlock;

  constructor(
    name: string,
    startingClass: Class,
    startingLevel: number,
    startingInternalLevel: number,
    startingSP: number,
    bases: StatBlock,
    growths: StatBlock,
    caps: StatBlock
  ) {
    this.name = name;
    this.startingClass = startingClass;
    this.startingLevel = startingLevel;
    this.startingInternalLevel = startingInternalLevel;
    this.startingSP = startingSP;
    this.bases = bases;
    this.growths = growths;
    this.caps = caps;
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

  getTotalCaps(): StatBlock {
    return StatBlock.add(this.character.caps, this.class.caps);
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
    // Stat gains in starting class
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

    // Stat gains in current class
    const currentClassGrowthsPoints = StatBlock.multiply(
      this.getTotalGrowths(),
      levelsCurrentCLass
    );

    // All stat gains
    const totalGrowthsPoints = StatBlock.add(
      startingClassGrowthsPoints,
      currentClassGrowthsPoints
    );
    const uncappedStats = StatBlock.add(
      StatBlock.add(this.character.bases, this.class.bases),
      StatBlock.multiply(totalGrowthsPoints, 1 / 100)
    );

    // Applying stat caps
    const cappedStats = StatBlock.binaryOperator(
      uncappedStats,
      this.getTotalCaps(),
      Math.min
    );

    return cappedStats;
  }
}
