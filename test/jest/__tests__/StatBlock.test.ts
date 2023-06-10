import { StatBlock } from 'src/models/StatBlock';
import { describe, expect, it } from '@jest/globals';

function makeRandomStatBlock(floored = true): StatBlock {
  const statValues = Array.from({ length: StatBlock.statNames.length }, () =>
    floored ? Math.floor(Math.random() * 100) : Math.random() * 100
  ) as [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  return new StatBlock(...statValues);
}

describe('StatBlock', () => {
  it('should add stats', async () => {
    const statBlockA = makeRandomStatBlock();
    const statBlockB = makeRandomStatBlock();
    const statBlockAdd = StatBlock.add(statBlockA, statBlockB);
    for (const stat in StatBlock.statNames) {
      expect(statBlockAdd.get(stat)).toEqual(
        statBlockA.get(stat) + statBlockB.get(stat)
      );
    }
  });
});

describe('StatBlock', () => {
  it('should substract stats', async () => {
    const statBlockA = makeRandomStatBlock();
    const statBlockB = makeRandomStatBlock();
    const statBlockSub = StatBlock.substract(statBlockA, statBlockB);
    for (const stat in StatBlock.statNames) {
      expect(statBlockSub.get(stat)).toEqual(
        statBlockA.get(stat) - statBlockB.get(stat)
      );
    }
  });
});

describe('StatBlock', () => {
  it('should multiply stats', async () => {
    const statBlockA = makeRandomStatBlock();
    const multiplyer = Math.floor(Math.random() * 100);
    const statBlockMult = StatBlock.multiply(statBlockA, multiplyer);
    for (const stat in StatBlock.statNames) {
      expect(statBlockMult.get(stat)).toEqual(
        statBlockA.get(stat) * multiplyer
      );
    }
  });
});

describe('StatBlock', () => {
  it('should floor stats', async () => {
    const statBlockA = makeRandomStatBlock();
    const statBlockFloor = StatBlock.floor(statBlockA);
    for (const stat in StatBlock.statNames) {
      expect(statBlockFloor.get(stat)).toEqual(
        Math.floor(statBlockA.get(stat))
      );
    }
  });
});
