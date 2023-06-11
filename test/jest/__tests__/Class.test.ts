import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import data from './Data';

beforeAll(() => {
  return data.loadFromDisk();
});

describe('Class', () => {
  it('should load classes', () => {
    expect(Object.keys(data.classes).length).toBeGreaterThan(0);
  });

  it('should load weapon proficiencies', () => {
    const ddClass = data.classes['JID_神竜ノ王'];
    expect(ddClass.weaponProficiencies.length).toEqual(2);
  });
});
