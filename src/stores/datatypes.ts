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

  static statNames: string[] = [
    'hp',
    'str',
    'mag',
    'dex',
    'spd',
    'def',
    'res',
    'lck',
    'bld',
    'mov',
  ];

  get(statName: string): number {
    return Number(
      (this as StatBlock)[statName.toLowerCase() as keyof StatBlock]
    );
  }

  get rating() {
    return (
      this.str +
      this.mag +
      this.dex +
      this.spd +
      this.def +
      this.res +
      this.lck +
      this.bld
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

  static unaryOperator(
    a: StatBlock,
    operator: (a: number) => number
  ): StatBlock {
    return new StatBlock(
      operator(a.hp),
      operator(a.str),
      operator(a.mag),
      operator(a.dex),
      operator(a.spd),
      operator(a.def),
      operator(a.res),
      operator(a.lck),
      operator(a.bld),
      operator(a.mov)
    );
  }

  static add(a: StatBlock, b: StatBlock): StatBlock {
    return StatBlock.binaryOperator(a, b, (a, b) => a + b);
  }

  static substract(a: StatBlock, b: StatBlock): StatBlock {
    return StatBlock.binaryOperator(a, b, (a, b) => a - b);
  }

  static multiply(a: StatBlock, b: number): StatBlock {
    return StatBlock.unaryOperator(a, (a) => a * b);
  }

  static floor(a: StatBlock): StatBlock {
    return StatBlock.unaryOperator(a, Math.floor);
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
  name: string;
  tier: ClassTier;
  type: ClassType;
  bases: StatBlock;
  growths: StatBlock;
  caps: StatBlock;
  isPlayable: boolean;
  femaleOnly: boolean;
  exclusiveCharacterName: string;

  constructor(
    name: string,
    tier: ClassTier,
    type: ClassType,
    bases: StatBlock,
    growths: StatBlock,
    caps: StatBlock,
    isPlayable: boolean,
    femaleOnly: boolean,
    exclusiveCharacterName: string
  ) {
    this.name = name;
    this.tier = tier;
    this.type = type;
    this.bases = bases;
    this.growths = growths;
    this.caps = caps;
    this.isPlayable = isPlayable;
    this.femaleOnly = femaleOnly;
    this.exclusiveCharacterName = exclusiveCharacterName;
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
  isFemale: boolean;

  constructor(
    name: string,
    startingClass: Class,
    startingLevel: number,
    startingInternalLevel: number,
    startingSP: number,
    bases: StatBlock,
    growths: StatBlock,
    caps: StatBlock,
    isFemale: boolean
  ) {
    this.name = name;
    this.startingClass = startingClass;
    this.startingLevel = startingLevel;
    this.startingInternalLevel = startingInternalLevel;
    this.startingSP = startingSP;
    this.bases = bases;
    this.growths = growths;
    this.caps = caps;
    this.isFemale = isFemale;
  }

  get startingTotalLevel(): number {
    return this.startingInternalLevel + this.startingLevel;
  }

  canUseClass(clss: Class): boolean {
    let canUse = clss.isPlayable;
    canUse &&= !clss.femaleOnly || this.isFemale;
    canUse &&=
      clss.exclusiveCharacterName == '' ||
      clss.exclusiveCharacterName == this.name;
    return canUse;
  }
}

export class Unit {
  character: Character;
  class: Class;
  level: number;
  sp: number;

  constructor(character: Character) {
    this.character = character;
    this.class = character.startingClass;
    this.level = character.startingLevel;
    this.sp = character.startingSP;
  }

  get totalBases(): StatBlock {
    return StatBlock.add(
      this.character.bases,
      StatBlock.substract(this.class.bases, this.character.startingClass.bases)
    );
  }

  get totalGrowths(): StatBlock {
    return StatBlock.add(this.character.growths, this.class.growths);
  }

  get totalCaps(): StatBlock {
    return StatBlock.add(this.character.caps, this.class.caps);
  }

  get internalLevel(): number {
    let internalLevel = this.character.startingInternalLevel;
    if (this.class != this.character.startingClass) {
      internalLevel += this.character.startingLevel;
      if (this.class.tier.equals(ClassTier.Advanced)) {
        internalLevel = Math.max(
          internalLevel,
          this.character.startingClass.tier.promotionLevel
        );
      }
    }
    return internalLevel;
  }

  get totalLevel(): number {
    // If internal lvl > 0, we take away 1 because promotion lvl is not a real lvl
    return Math.max(0, this.internalLevel - 1) + this.level;
  }

  get stats(): StatBlock {
    // Innate growth points
    const startingGrowthPoints = this.character.growths;

    // Stat gains in starting class
    const levelsStartingClass =
      this.internalLevel - this.character.startingInternalLevel;

    const startingClassGrowths = StatBlock.add(
      this.character.growths,
      this.class.growths
    );
    const startingClassGrowthsPoints = StatBlock.multiply(
      startingClassGrowths,
      levelsStartingClass
    );

    // Stat gains in current class
    let levelsCurrentCLass = this.level;
    if (this.class == this.character.startingClass) {
      levelsCurrentCLass -= this.character.startingLevel;
    }

    const currentClassGrowthsPoints = StatBlock.multiply(
      this.totalGrowths,
      levelsCurrentCLass
    );

    // All stat gains
    const totalGrowthsPoints = StatBlock.add(
      startingGrowthPoints,
      StatBlock.add(startingClassGrowthsPoints, currentClassGrowthsPoints)
    );
    const uncappedStats = StatBlock.add(
      this.totalBases,
      StatBlock.floor(StatBlock.multiply(totalGrowthsPoints, 1 / 100))
    );

    // Applying stat caps
    const cappedStats = StatBlock.binaryOperator(
      uncappedStats,
      this.totalCaps,
      Math.min
    );

    return cappedStats;
  }

  get atk(): number {
    // Placeholder until equipment is added
    return Math.max(this.stats.str, this.stats.mag);
  }

  get hit(): number {
    // Placeholder until equipment is added
    return 100 + 2 * this.stats.dex + Math.floor(this.stats.lck / 2);
  }

  get avo(): number {
    return 2 * this.stats.spd + Math.floor(this.stats.lck / 2);
  }

  get crit(): number {
    // Placeholder until equipment is added
    return Math.floor(this.stats.dex / 2);
  }

  get ddg(): number {
    return this.stats.lck;
  }
}
