import { Class } from './Class';
import { StatBlock } from './StatBlock';

export class Character {
  name: string;
  id: string;
  startingClass: Class;
  startingLevel: number;
  startingInternalLevel: number;
  startingSP: number;
  bases: StatBlock;
  growths: StatBlock;
  caps: StatBlock;
  isFemale: boolean;

  constructor(
    id: string,
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
