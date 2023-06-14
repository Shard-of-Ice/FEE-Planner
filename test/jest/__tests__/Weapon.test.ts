import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import data from './Data';
import {
  ForgingUpgrade,
  ProficiencyLevel,
  WeaponType,
} from 'src/models/Weapon';

beforeAll(() => {
  return data.loadFromDisk();
});

describe('WeaponData', () => {
  it('should load weapons', () => {
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
    const ironSword = data.weapons['IID_鋼の剣'];
    expect(ironSword.forgingUpgrades.length).toEqual(5);
  });

  it('should have correct steel sword forging upgrades', () => {
    const ironSword = data.weapons['IID_鋼の剣'];
    const expectedUpgrades = [
      new ForgingUpgrade(1, 2, 0, 0, 0),
      new ForgingUpgrade(2, 2, 5, 0, 0),
      new ForgingUpgrade(3, 4, 5, 0, -1),
      new ForgingUpgrade(4, 4, 10, 5, -1),
      new ForgingUpgrade(5, 6, 10, 5, -2),
    ];

    for (let i = 0; i < expectedUpgrades.length; i++) {
      const expected = expectedUpgrades[i];
      const actual = ironSword.forgingUpgrades[i];
      expect(actual).toEqual(expected);
    }
  });
});
