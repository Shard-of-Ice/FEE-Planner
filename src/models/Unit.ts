import { Character } from './Character';
import { Class, ClassTier } from './Class';
import { SyncedEmblem } from './Emblem';
import { CharacterStats } from './StatBlock';
import {
  Weapon,
  WeaponData,
  WeaponProficiencies,
  WeaponProficiency,
  WeaponType,
} from './Weapon';

export class Unit {
  character: Character;
  private _class: Class;
  level: number;
  sp: number;
  weapon: Weapon;
  emblem: SyncedEmblem;

  constructor(
    character: Character,
    level: number | null = null,
    clss: Class | null = null,
    weapon: Weapon | null = null,
    emblem: SyncedEmblem | null = null
  ) {
    this.character = character;
    this._class = clss || character.startingClass;
    this.level = level || character.startingLevel;
    this.sp = character.startingSP;
    this.weapon = weapon || new Weapon();
    this.emblem = emblem || new SyncedEmblem();
  }

  get class(): Class {
    return this._class;
  }

  set class(clss: Class) {
    this._class = clss;
    // Check if we should unequip weapon (if we can no longer weild it)
    if (this.weapon.data && !this.canEquip(this.weapon.data)) {
      this.weapon.data = null;
    }
  }

  get totalBases(): CharacterStats {
    return CharacterStats.add(
      this.character.bases,
      CharacterStats.substract(
        this.class.bases,
        this.character.startingClass.bases
      )
    );
  }

  get totalGrowths(): CharacterStats {
    return CharacterStats.add(this.character.growths, this.class.growths);
  }

  get totalCaps(): CharacterStats {
    return CharacterStats.add(this.character.caps, this.class.caps);
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

  get bonusStats(): CharacterStats {
    // Speed penalty from heavy weapons.
    // Can never bring speed lower than 0.
    const speedPenalty = Math.min(
      0, // maximum
      Math.max(
        -this.statsWithoutBonuses.spd, // minimum
        this.statsWithoutBonuses.bld - (this.weapon?.stats.weight || 0)
      )
    );
    // Total
    return CharacterStats.add(
      this.emblem.bondLevelData?.bonusStats || new CharacterStats(),
      new CharacterStats({ spd: speedPenalty })
    );
  }

  get bonusRating(): number {
    return Object.values(this.bonusStats).reduce((sum, cur) => sum + cur, 0);
  }

  get statsWithoutBonuses(): CharacterStats {
    // Innate growth points
    const startingGrowthPoints = this.character.growths;

    // Stat gains in starting class
    const levelsStartingClass =
      this.internalLevel - this.character.startingInternalLevel;

    const startingClassGrowths = CharacterStats.add(
      this.character.growths,
      this.class.growths
    );
    const startingClassGrowthsPoints = CharacterStats.multiply(
      startingClassGrowths,
      levelsStartingClass
    );

    // Stat gains in current class
    let levelsCurrentCLass = this.level;
    if (this.class == this.character.startingClass) {
      levelsCurrentCLass -= this.character.startingLevel;
    }

    const currentClassGrowthsPoints = CharacterStats.multiply(
      this.totalGrowths,
      levelsCurrentCLass
    );

    // All stat gains
    const totalGrowthsPoints = CharacterStats.add(
      startingGrowthPoints,
      CharacterStats.add(startingClassGrowthsPoints, currentClassGrowthsPoints)
    );
    const uncappedStats = CharacterStats.add(
      this.totalBases,
      CharacterStats.floor(CharacterStats.multiply(totalGrowthsPoints, 1 / 100))
    );

    // Applying stat caps
    const cappedStats = CharacterStats.binaryOperator(
      uncappedStats,
      this.totalCaps,
      Math.min
    );

    return cappedStats;
  }

  get stats(): CharacterStats {
    return CharacterStats.add(this.statsWithoutBonuses, this.bonusStats);
  }

  get weaponProficiencies(): WeaponProficiencies {
    return new WeaponProficiencies(
      this.class.weaponProficiencies.list.map((p) => {
        if (this.canIncreaseProficiency(p)) {
          return {
            weaponType: p.weaponType,
            level: p.level.getHigherLevel(),
          };
        } // else
        return p;
      })
    );
  }

  private canIncreaseProficiency(
    weaponProficiency: WeaponProficiency
  ): boolean {
    return (
      // Technically, only the second check has value in practice
      // The first check is kept to prevent misunderstandings
      weaponProficiency.level.canBeIncreased &&
      this.character.innateProficiencies.some((wp) =>
        wp.equals(weaponProficiency.weaponType)
      )
    );
  }

  increasesProficiency(weaponType: WeaponType): boolean {
    return this.canIncreaseProficiency(
      this.class.weaponProficiencies.get(weaponType)
    );
  }

  get atk(): number {
    if (this.weapon?.data?.type === WeaponType.Canonball) {
      // Special calculation for canonball
      return this.stats.dex + this.weapon.stats.might;
    }
    // else
    return (
      (this.weapon?.stats.might || 0) +
      (this.weapon.data?.usesMagicStat ? this.stats.mag : this.stats.str)
    );
  }

  get hit(): number {
    if (this.weapon?.data?.type === WeaponType.Canonball) {
      // Special calculation for canonball
      return (
        this.stats.dex +
        this.stats.str +
        this.stats.bld +
        this.stats.lck / 2 +
        this.weapon.stats.hit
      );
    }
    // else
    return (
      (this.weapon?.stats.hit || 100) +
      2 * this.stats.dex +
      Math.floor(this.stats.lck / 2)
    );
  }

  get avo(): number {
    return Math.max(
      0,
      (this.weapon?.stats.avoid || 0) +
        2 * this.stats.spd +
        Math.floor(this.stats.lck / 2)
    );
  }

  get crit(): number {
    return Math.max(
      0,
      (this.weapon?.stats.critical || 0) + Math.floor(this.stats.dex / 2)
    );
  }

  get ddg(): number {
    return Math.max(0, (this.weapon?.stats.dodge || 0) + this.stats.lck);
  }

  canEquip(weapon: WeaponData): boolean {
    return (
      // The weapon is useable by the player
      weapon.isPlayable &&
      // The weapon is not exclusive, or is exclusive to this character
      (weapon.exclusiveCharacterName == '' ||
        weapon.exclusiveCharacterName == this.character.name) &&
      // This character has enough proficiency to use the weapon
      this.weaponProficiencies
        .get(weapon.type)
        .level.greaterOrEqualTo(weapon.rank)
    );
  }
}
