import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import data from './Data';
import {
  Engraving,
  ForgingUpgrade,
  ProficiencyLevel,
  Weapon,
  WeaponType,
} from 'src/models/Weapon';
import { WeaponStats } from 'src/models/StatBlock';

beforeAll(() => {
  return data.loadFromDisk();
});

describe('WeaponData', () => {
  it('should load weapon data', () => {
    expect(Object.keys(data.weapons).length).toBeGreaterThan(0);
  });

  it('should load iron sword', () => {
    const ironSword = data.weapons['IID_鉄の剣'];
    expect(ironSword.name).toEqual('Iron Sword');
    expect(ironSword.type).toEqual(WeaponType.Sword);
    expect(ironSword.stats.might).toEqual(5);
    expect(ironSword.stats.hit).toEqual(90);
    expect(ironSword.stats.critical).toEqual(0);
    expect(ironSword.stats.weight).toEqual(5);
    expect(ironSword.stats.avoid).toEqual(0);
    expect(ironSword.stats.dodge).toEqual(0);
    expect(ironSword.rank).toEqual(ProficiencyLevel.D);
  });

  it('should have forging upgrades', () => {
    const steelSword = data.weapons['IID_鋼の剣'];
    expect(steelSword.forgingUpgrades.length).toEqual(6);
  });

  it('should have correct steel sword forging upgrades', () => {
    const steelSword = data.weapons['IID_鋼の剣'];
    const expectedUpgrades = [
      new WeaponStats({ might: 0, weight: 0, hit: 0, critical: 0 }),
      new WeaponStats({ might: 2, weight: 0, hit: 0, critical: 0 }),
      new WeaponStats({ might: 2, weight: 0, hit: 5, critical: 0 }),
      new WeaponStats({ might: 4, weight: -1, hit: 5, critical: 0 }),
      new WeaponStats({ might: 4, weight: -1, hit: 10, critical: 5 }),
      new WeaponStats({ might: 6, weight: -2, hit: 10, critical: 5 }),
    ];

    for (let i = 0; i < expectedUpgrades.length; i++) {
      const expected = expectedUpgrades[i];
      const actual = steelSword.forgingUpgrades[i].stats;
      expect(actual).toEqual(expected);
    }
  });

  it('should calculate final stats correctly', () => {
    const steelSword = data.weapons['IID_鋼の剣'];
    const alearEngraving = data.engravings['GID_リュール'];
    const steelSwordPlus1Marth = new Weapon(steelSword, 4, alearEngraving);

    const expected = {
      might: 9 + 4 - 1,
      hit: 85 + 10 + 20,
      critical: 5 + 5 + 20,
      weight: 8 - 1 - 1,
      avoid: 0 + 0 + 20,
      dodge: 0 + 0 + 20,
    };
    const actual = {
      might: steelSwordPlus1Marth.stats.might,
      hit: steelSwordPlus1Marth.stats.hit,
      critical: steelSwordPlus1Marth.stats.critical,
      weight: steelSwordPlus1Marth.stats.weight,
      avoid: steelSwordPlus1Marth.stats.avoid,
      dodge: steelSwordPlus1Marth.stats.dodge,
    };

    expect(actual).toEqual(expected);
  });
});

describe('Engraving', () => {
  it('should load', () => {
    expect(Object.keys(data.engravings).length).toBeGreaterThan(0);
  });

  it('should have correct data for Marth', () => {
    const marthEngraving = data.engravings['GID_マルス'];
    expect(marthEngraving).toEqual(
      new Engraving(
        'Marth',
        new WeaponStats({
          might: 1,
          weight: 0,
          hit: 10,
          critical: 10,
          avoid: 5,
          dodge: 5,
        })
      )
    );
  });
});
