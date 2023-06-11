import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import data from './Data';

beforeAll(() => {
  return data.loadFromDisk();
});

describe('Weapon', () => {
  it('should load weapons', () => {
    expect(Object.keys(data.weapons).length).toBeGreaterThan(0);
  });
});
