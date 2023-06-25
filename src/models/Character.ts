import { Class } from './Class';
import { CharacterStats } from './StatBlock';
import { WeaponType } from './Weapon';

export class Character {
  name: string;
  id: string;
  isFemale: boolean;

  startingClass: Class;
  startingLevel: number;
  startingInternalLevel: number;
  startingSP: number;

  bases: CharacterStats;
  growths: CharacterStats;
  caps: CharacterStats;

  innateProficiencies: WeaponType[];

  constructor(
    id: string,
    name: string,
    isFemale: boolean,
    startingClass: Class,
    startingLevel: number,
    startingInternalLevel: number,
    startingSP: number,
    bases: CharacterStats,
    growths: CharacterStats,
    caps: CharacterStats,
    innateProficiencies: WeaponType[]
  ) {
    this.id = id;
    this.name = name;
    this.startingClass = startingClass;
    this.startingLevel = startingLevel;
    this.startingInternalLevel = startingInternalLevel;
    this.startingSP = startingSP;
    this.bases = bases;
    this.growths = growths;
    this.caps = caps;
    this.isFemale = isFemale;
    this.innateProficiencies = innateProficiencies;
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
