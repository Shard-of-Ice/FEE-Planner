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
    expect(ironSword.might).toEqual(5);
    expect(ironSword.hit).toEqual(90);
    expect(ironSword.critical).toEqual(0);
    expect(ironSword.weight).toEqual(5);
    expect(ironSword.avoid).toEqual(0);
    expect(ironSword.dodge).toEqual(0);
    expect(ironSword.rank).toEqual(ProficiencyLevel.D);
  });

  it('should have forging upgrades', () => {
    const steelSword = data.weapons['IID_鋼の剣'];
    expect(steelSword.forgingUpgrades.length).toEqual(6);
  });

  it('should have correct steel sword forging upgrades', () => {
    const steelSword = data.weapons['IID_鋼の剣'];
    const expectedUpgrades = [
      new ForgingUpgrade(0, 0, 0, 0, 0),
      new ForgingUpgrade(1, 2, 0, 0, 0),
      new ForgingUpgrade(2, 2, 0, 5, 0),
      new ForgingUpgrade(3, 4, -1, 5, 0),
      new ForgingUpgrade(4, 4, -1, 10, 5),
      new ForgingUpgrade(5, 6, -2, 10, 5),
    ];

    for (let i = 0; i < expectedUpgrades.length; i++) {
      const expected = expectedUpgrades[i];
      const actual = steelSword.forgingUpgrades[i];
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
      might: steelSwordPlus1Marth.might,
      hit: steelSwordPlus1Marth.hit,
      critical: steelSwordPlus1Marth.critical,
      weight: steelSwordPlus1Marth.weight,
      avoid: steelSwordPlus1Marth.avoid,
      dodge: steelSwordPlus1Marth.dodge,
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
    expect(marthEngraving).toEqual(new Engraving('Marth', 1, 0, 10, 10, 5, 5));
  });
});
