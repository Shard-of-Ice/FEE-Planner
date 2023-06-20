import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import { CharacterStats } from 'src/models/StatBlock';
import { Unit } from 'src/models/Unit';
import data from './Data';
import { Weapon } from 'src/models/Weapon';
import { SyncedEmblem } from 'src/models/Emblem';

beforeAll(() => {
  return data.loadFromDisk();
});

describe('Unit', () => {
  it('should have the right starting stats', () => {
    const alear = data.characters['PID_リュール'];
    const alearUnit = new Unit(alear);
    const alearStats = new CharacterStats({
      hp: 22,
      str: 6,
      mag: 0,
      dex: 5,
      spd: 7,
      def: 5,
      res: 3,
      lck: 5,
      bld: 4,
      mov: 4,
    });

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 10 stats', () => {
    const alear = data.characters['PID_リュール'];
    const alearUnit = new Unit(alear, 10);
    const alearStats = new CharacterStats({
      hp: 28,
      str: 10,
      mag: 2,
      dex: 10,
      spd: 13,
      def: 9,
      res: 6,
      lck: 7,
      bld: 4,
      mov: 4,
    });

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 10 stats as a mage', () => {
    const alear = data.characters['PID_リュール'];
    const mageClass = data.classes['JID_マージ'];
    const alearUnit = new Unit(alear, 10, mageClass);
    const alearStats = new CharacterStats({
      hp: 25,
      str: 5,
      mag: 12,
      dex: 14,
      spd: 12,
      def: 5,
      res: 12,
      lck: 8,
      bld: 4,
      mov: 4,
    });

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 1 (10) stats after promotion', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 1, promotedClass);
    const alearStats = new CharacterStats({
      hp: 32,
      str: 13,
      mag: 3,
      dex: 13,
      spd: 15,
      def: 12,
      res: 9,
      lck: 10,
      bld: 8,
      mov: 5,
    });

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 20 (29) stats after promotion', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 20, promotedClass);
    const alearStats = new CharacterStats({
      hp: 45,
      str: 21,
      mag: 7,
      dex: 23,
      spd: 28,
      def: 22,
      res: 17,
      lck: 16,
      bld: 10,
      mov: 5,
    });

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 20 (48) stats after re-promotion', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 39, promotedClass);
    const alearStats = new CharacterStats({
      hp: 58,
      str: 30,
      mag: 11,
      dex: 34,
      spd: 40,
      def: 33,
      res: 24,
      lck: 23,
      bld: 11,
      mov: 5,
    });

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should never exceed stat caps', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 99, promotedClass);

    for (const statName of CharacterStats.getStatNames()) {
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

  it('sould calculate battle statistics correctly', () => {
    const alear = data.characters['PID_リュール'];
    const ironSword = data.weapons['IID_鉄の剣'];
    const marthEmblem = data.emblems['GID_マルス'];
    const alearUnit = new Unit(
      alear,
      null,
      null,
      new Weapon(ironSword, 0),
      new SyncedEmblem(marthEmblem, 1)
    );
    const expected = {
      atk: 12,
      hit: 104,
      avo: 16,
      crit: 3,
      ddg: 5,
    };
    const actual = {
      atk: alearUnit.atk,
      hit: alearUnit.hit,
      avo: alearUnit.avo,
      crit: alearUnit.crit,
      ddg: alearUnit.ddg,
    };
    expect(actual).toEqual(expected);
  });

  it('sould be slowed dosn by heavy weapons', () => {
    const alear = data.characters['PID_リュール'];
    const ironBlade = data.weapons['IID_鉄の大剣'];
    const alearUnit = new Unit(alear, null, null, new Weapon(ironBlade, 0));
    expect(alearUnit.bonusStats).toEqual(
      new CharacterStats({
        spd: -3,
      })
    );
    expect(alearUnit.stats).toEqual(
      new CharacterStats({
        hp: 22,
        str: 6,
        mag: 0,
        dex: 5,
        spd: 4,
        def: 5,
        res: 3,
        lck: 5,
        bld: 4,
        mov: 4,
      })
    );
  });

  it('sould benefit from emblems', () => {
    const alear = data.characters['PID_リュール'];
    const marthEmblem = data.emblems['GID_マルス'];
    const alearUnit = new Unit(
      alear,
      null,
      null,
      null,
      new SyncedEmblem(marthEmblem, 2)
    );
    expect(alearUnit.bonusStats).toEqual(
      new CharacterStats({
        str: 1,
        dex: 2,
        spd: 1,
      })
    );
    expect(alearUnit.stats).toEqual(
      new CharacterStats({
        hp: 22,
        str: 7,
        mag: 0,
        dex: 7,
        spd: 8,
        def: 5,
        res: 3,
        lck: 5,
        bld: 4,
        mov: 4,
      })
    );
  });
});
