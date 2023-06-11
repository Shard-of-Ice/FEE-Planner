import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import { StatBlock } from 'src/models/StatBlock';
import { Unit } from 'src/models/Unit';
import data from './Data';

beforeAll(() => {
  return data.loadFromDisk();
});

describe('Unit', () => {
  it('should have the right starting stats', () => {
    const alear = data.characters['PID_リュール'];
    const alearUnit = new Unit(alear);
    const alearStats = new StatBlock(22, 6, 0, 5, 7, 5, 3, 5, 4, 4);

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 10 stats', () => {
    const alear = data.characters['PID_リュール'];
    const alearUnit = new Unit(alear, 10);
    const alearStats = new StatBlock(28, 10, 2, 10, 13, 9, 6, 7, 4, 4);

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 10 stats as a mage', () => {
    const alear = data.characters['PID_リュール'];
    const mageClass = data.classes['JID_マージ'];
    const alearUnit = new Unit(alear, 10, mageClass);
    const alearStats = new StatBlock(25, 5, 12, 14, 12, 5, 12, 8, 4, 4);

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 1 (10) stats after promotion', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 1, promotedClass);
    const alearStats = new StatBlock(32, 13, 3, 13, 15, 12, 9, 10, 8, 5);

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 20 (29) stats after promotion', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 20, promotedClass);
    const alearStats = new StatBlock(45, 21, 7, 23, 28, 22, 17, 16, 10, 5);

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 20 (48) stats after re-promotion', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 39, promotedClass);
    const alearStats = new StatBlock(58, 30, 11, 34, 40, 33, 24, 23, 11, 5);

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should never exceed stat caps', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 99, promotedClass);

    for (const statName of StatBlock.statNames) {
      expect(alearUnit.stats.get(statName)).toBeLessThanOrEqual(
        alearUnit.totalCaps.get(statName)
      );
    }
  });

  it('should not let a player character equip an unplayable weapon', () => {
    const alear = data.characters['PID_リュール'];
    const alearUnit = new Unit(alear);
    const liberationPrologue = data.weapons['IID_リベラシオン_M000'];

    expect(alearUnit.canEquip(liberationPrologue)).toBeFalsy();
  });

  it('should let alear equip Libération (weapon exclusive to him)', () => {
    const alear = data.characters['PID_リュール'];
    const alearUnit = new Unit(alear);
    const liberation = data.weapons['IID_リベラシオン'];

    expect(alearUnit.canEquip(liberation)).toBeTruthy();
  });

  it('should not let alear equip Obscurité (weapon exclusive to Veyle)', () => {
    const alear = data.characters['PID_リュール'];
    const alearUnit = new Unit(alear);
    const obscurite = data.weapons['IID_オヴスキュリテ'];

    expect(alearUnit.canEquip(obscurite)).toBeFalsy();
  });

  it('should let alear equip an iron sword', () => {
    const alear = data.characters['PID_リュール'];
    const alearUnit = new Unit(alear);
    const ironSword = data.weapons['IID_鉄の剣'];

    expect(alearUnit.canEquip(ironSword)).toBeTruthy();
  });

  it('should not let alear equip an iron bow', () => {
    const alear = data.characters['PID_リュール'];
    const alearUnit = new Unit(alear);
    const ironBow = data.weapons['IID_鉄の弓'];

    expect(alearUnit.canEquip(ironBow)).toBeFalsy();
  });

  it('should not let unpromoted alear equip a brave sword', () => {
    const alear = data.characters['PID_リュール'];
    const alearUnit = new Unit(alear);
    const braveSword = data.weapons['IID_勇者の剣'];

    expect(alearUnit.canEquip(braveSword)).toBeFalsy();
  });

  it('should let promoted alear equip a brave sword', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 1, promotedClass);
    const braveSword = data.weapons['IID_勇者の剣'];

    expect(alearUnit.canEquip(braveSword)).toBeTruthy();
  });
});
