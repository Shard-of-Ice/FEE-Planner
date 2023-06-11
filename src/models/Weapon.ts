export class Weapon {
  id: string;
  name: string;
  type: WeaponType;
  might: number;
  hit: number;
  critical: number;
  weight: number;
  avoid: number;
  dodge: number;
  rank: string;
  playable = false;

  constructor(
    id: string,
    name: string,
    type: WeaponType,
    might: number,
    hit: number,
    critical: number,
    weight: number,
    avoid: number,
    dodge: number,
    rank: string,
    playable: boolean
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.might = might;
    this.hit = hit;
    this.critical = critical;
    this.weight = weight;
    this.avoid = avoid;
    this.dodge = dodge;
    this.rank = rank;
    this.playable = playable;
  }
}

export class WeaponType {
  static Sword = new WeaponType('Sword');
  static Lance = new WeaponType('Lance');
  static Axe = new WeaponType('Axe');
  static Bow = new WeaponType('Bow');
  static Dagger = new WeaponType('Dagger');
  static Tome = new WeaponType('Tome');
  static Staff = new WeaponType('Staff');
  static Arts = new WeaponType('Arts');
  static Special = new WeaponType('Special');
  static None = new WeaponType('None');

  static all: WeaponType[] = [
    WeaponType.Sword,
    WeaponType.Lance,
    WeaponType.Axe,
    WeaponType.Bow,
    WeaponType.Dagger,
    WeaponType.Tome,
    WeaponType.Staff,
    WeaponType.Arts,
    WeaponType.Special,
  ];

  readonly name: string;
  private constructor(name: string) {
    this.name = name;
  }

  static fromString(str: string): WeaponType {
    for (const type of WeaponType.all) {
      if (type.name == str) {
        return type;
      }
    }
    // default
    console.warn('Unknown weapon type ' + str);
    return WeaponType.None;
  }

  equals(other: WeaponType): boolean {
    return this.name == other.name;
  }
}

export interface WeaponProficiency {
  weaponType: WeaponType;
  level: string;
}
