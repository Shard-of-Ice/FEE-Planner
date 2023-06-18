export class Emblem {
  name: string;
  bondLevels: BondLevel[];

  constructor(name: string, bondLevels: BondLevel[] = []) {
    this.name = name;
    this.bondLevels = bondLevels;
  }
}

export class BondLevel {}
