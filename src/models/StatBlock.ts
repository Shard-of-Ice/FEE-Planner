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
