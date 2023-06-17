import { CharacterStats } from 'src/models/StatBlock';
import { describe, expect, it } from '@jest/globals';

function makeRandomStatBlock(floored = true): CharacterStats {
  return new CharacterStats(
    Object.fromEntries(
      CharacterStats.getStatNames().map((statName) => [
        statName,
        floored ? Math.floor(Math.random() * 100) : Math.random() * 100,
      ])
    )
  );
}

describe('CharacterStats', () => {
  it('should add stats', () => {
    const statBlockA = makeRandomStatBlock();
    const statBlockB = makeRandomStatBlock();
    const statBlockAdd = CharacterStats.add(statBlockA, statBlockB);
    for (const stat in CharacterStats.getStatNames()) {
      expect(statBlockAdd.get(stat)).toEqual(
        statBlockA.get(stat) + statBlockB.get(stat)
      );
    }
  });
});

describe('CharacterStats', () => {
  it('should substract stats', () => {
    const statBlockA = makeRandomStatBlock();
    const statBlockB = makeRandomStatBlock();
    const statBlockSub = CharacterStats.substract(statBlockA, statBlockB);
    for (const stat in CharacterStats.getStatNames()) {
      expect(statBlockSub.get(stat)).toEqual(
        statBlockA.get(stat) - statBlockB.get(stat)
      );
    }
  });
});

describe('CharacterStats', () => {
  it('should multiply stats', async () => {
    const statBlockA = makeRandomStatBlock();
    const multiplyer = Math.floor(Math.random() * 100);
    const statBlockMult = CharacterStats.multiply(statBlockA, multiplyer);
    for (const stat in CharacterStats.getStatNames()) {
      expect(statBlockMult.get(stat)).toEqual(
        statBlockA.get(stat) * multiplyer
      );
    }
  });
});

describe('CharacterStats', () => {
  it('should floor stats', async () => {
    const statBlockA = makeRandomStatBlock();
    const statBlockFloor = CharacterStats.floor(statBlockA);
    for (const stat in CharacterStats.getStatNames()) {
      expect(statBlockFloor.get(stat)).toEqual(
        Math.floor(statBlockA.get(stat))
      );
    }
  });
});
