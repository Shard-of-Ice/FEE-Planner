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
    // Placeholder until proper phys/mag separation is added
    return (
      (this.weapon?.might || 100) + Math.max(this.stats.str, this.stats.mag)
    );
  }

  get hit(): number {
    return (
      (this.weapon?.hit || 100) +
      2 * this.stats.dex +
      Math.floor(this.stats.lck / 2)
    );
  }

  get avo(): number {
    return (
      (this.weapon?.avoid || 0) +
      2 * this.stats.spd +
      Math.floor(this.stats.lck / 2)
    );
  }

  get crit(): number {
    return (this.weapon?.critical || 0) + Math.floor(this.stats.dex / 2);
  }

  get ddg(): number {
    return (this.weapon?.dodge || 0) + this.stats.lck;
  }

  canEquip(weapon: Weapon): boolean {
    return (
      // The weapon is useable by the player
      weapon.isPlayable &&
      // The weapon is not exclusive, or is exclusive to this character
      (weapon.exclusiveCharacterName == '' ||
        weapon.exclusiveCharacterName == this.character.name) &&
      // This character has enough proficiency to use the weapon
      this.class.weaponProficiencies.filter(
        (p) =>
          p.weaponType == weapon.type && p.level.greaterOrEqualTo(weapon.rank)
      ).length > 0
    );
  }
}
