import { Character } from './Character';
import { Class, ClassTier } from './Class';
import { StatBlock } from './StatBlock';
import { Weapon } from './Weapon';

export class Unit {
  character: Character;
  class: Class;
  level: number;
  sp: number;
  weapon: Weapon | null;

  constructor(
    character: Character,
    level: number | null = null,
    clss: Class | null = null,
    weapon: Weapon | null = null
  ) {
    this.character = character;
    this.class = clss || character.startingClass;
    this.level = level || character.startingLevel;
    this.sp = character.startingSP;
    this.weapon = weapon;
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
