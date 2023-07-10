import { WeaponType } from './Weapon';
import { CharacterStats, WeaponStats } from './StatBlock';
import { Unit } from './Unit';

export class Skill {
  name: string;
  id: string;
  description: string;
  spCost: number;

  characterBonus: CharacterStats;
  weaponBonus: WeaponStats;
  activationCondition: ActivationCondition;

  constructor(
    name: string,
    id: string,
    description: string,
    spCost: number,
    characterBonus: CharacterStats,
    weaponBonus: WeaponStats,
    activationCondition: ActivationCondition | null = null
  ) {
    this.name = name;
    this.id = id;
    this.description = description;
    this.spCost = spCost;
    this.characterBonus = characterBonus;
    this.weaponBonus = weaponBonus;
    this.activationCondition =
      activationCondition || ActivationCondition.always;
  }

  get learnable() {
    return this.spCost > 0;
  }
}

export class ActivationCondition {
  private fulfilmentFunction: (unit: Unit) => boolean;

  constructor(fulfilmentFunction: (unit: Unit) => boolean) {
    this.fulfilmentFunction = fulfilmentFunction;
  }

  isFulfilled(unit: Unit): boolean {
    return this.fulfilmentFunction(unit);
  }

  static always = new ActivationCondition(() => true);

  static never = new ActivationCondition(() => false);

  static weaponType(weaponType: WeaponType) {
    return new ActivationCondition(
      (unit) => unit.weapon.data?.type === weaponType
    );
  }
}
