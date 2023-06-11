import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import data from './Data';
import { ProficiencyLevel, WeaponType } from 'src/models/Weapon';

beforeAll(() => {
  return data.loadFromDisk();
});

describe('Weapon', () => {
  it('should load weapons', () => {
    expect(Object.keys(data.weapons).length).toBeGreaterThan(0);
  });
});

describe('Weapon', () => {
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
});
