type NumberDict = { [key: string]: number };

interface Factory<T> {
  make(data: NumberDict): T;
}

class GetSetAble {
  get(statName: string): number {
    return (this[statName as keyof typeof this] as number) || 0;
  }

  set(statName: string, value: number) {
    (this[statName as keyof typeof this] as number) = value;
  }

  getStatNames(): string[] {
    return Object.getOwnPropertyNames(this);
  }

  setAll(data: NumberDict) {
    for (const key in data) {
      this.set(key, data[key]);
    }
  }
}

abstract class FactoryAndGetSetable<T>
  extends GetSetAble
  implements Factory<T>
{
  abstract make(data?: NumberDict): T;
}

abstract class BaseStatBlock<
  T extends FactoryAndGetSetable<T>
> extends GetSetAble {
  static binaryOperator<T extends FactoryAndGetSetable<T>>(
    a: T,
    b: T,
    operator: (a: number, b: number) => number
  ): T {
    const res = a.make();
    Object.getOwnPropertyNames(a).forEach((statName) => {
      res.set(statName, operator(a.get(statName), b.get(statName)));
    });
    return res;
  }

  static unaryOperator<T extends FactoryAndGetSetable<T>>(
    a: T,
    operator: (a: number) => number
  ): T {
    const res = a.make();
    Object.getOwnPropertyNames(a).forEach((statName) => {
      res.set(statName, operator(a.get(statName)));
    });
    return res;
  }

  static add<T extends FactoryAndGetSetable<T>>(a: T, b: T): T {
    return BaseStatBlock.binaryOperator<T>(a, b, (a, b) => a + b);
  }

  static substract<T extends FactoryAndGetSetable<T>>(a: T, b: T): T {
    return BaseStatBlock.binaryOperator<T>(a, b, (a, b) => a - b);
  }

  static multiply<T extends FactoryAndGetSetable<T>>(a: T, b: number): T {
    return BaseStatBlock.unaryOperator<T>(a, (a) => a * b);
  }

  static floor<T extends FactoryAndGetSetable<T>>(a: T): T {
    return BaseStatBlock.unaryOperator<T>(a, Math.floor);
  }

  static min<T extends FactoryAndGetSetable<T>>(a: T, b: T): T {
    return BaseStatBlock.binaryOperator<T>(a, b, (a, b) => Math.max(a, b));
  }

  static max<T extends FactoryAndGetSetable<T>>(a: T, b: T): T {
    return BaseStatBlock.binaryOperator<T>(a, b, (a, b) => Math.max(a, b));
  }
}

export class CharacterStats extends BaseStatBlock<CharacterStats> {
  hp = 0;
  str = 0;
  mag = 0;
  dex = 0;
  spd = 0;
  def = 0;
  res = 0;
  lck = 0;
  bld = 0;
  mov = 0;

  constructor(data: NumberDict = {}) {
    super();
    this.setAll(data);
  }

  make(data: NumberDict = {}): CharacterStats {
    return new CharacterStats(data);
  }

  static getStatNames(): string[] {
    return new CharacterStats().getStatNames();
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
}

export class WeaponStats extends BaseStatBlock<WeaponStats> {
  might = 0;
  hit = 0;
  critical = 0;
  weight = 0;
  avoid = 0;
  dodge = 0;

  constructor(data: NumberDict = {}) {
    super();
    this.setAll(data);
  }

  make(data: NumberDict = {}): WeaponStats {
    return new WeaponStats(data);
  }

  static getStatNames(): string[] {
    return new WeaponStats({}).getStatNames();
  }
}
