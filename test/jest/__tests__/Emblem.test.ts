import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import data from './Data';
import { BondLevel, Emblem } from 'src/models/Emblem';
import { CharacterStats } from 'src/models/StatBlock';

beforeAll(() => {
  return data.loadFromDisk();
});

describe('Emblem', () => {
  it('should load', () => {
    expect(Object.keys(data.emblems).length).toBeGreaterThan(0);
  });

  it('should have correct data for Marth', () => {
    const marthEmblem = data.emblems['GID_マルス'];
    expect(marthEmblem.name).toEqual('Marth');
    expect(marthEmblem.bondLevels.length).toEqual(21);
    expect(marthEmblem.bondLevels[2]).toEqual(
      new BondLevel(
        2,
        new CharacterStats({
          str: 1,
          dex: 2,
          spd: 1,
        })
      )
    );
  });
});
