import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import data from './Data';
import { Emblem } from 'src/models/Emblem';

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
  });
});
