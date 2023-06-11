import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import data from './Data';

beforeAll(() => {
  return data.loadFromDisk();
});

describe('Character', () => {
  it('should load characters', () => {
    expect(Object.keys(data.characters).length).toBeGreaterThan(0);
  });

  it('should have the right starting class', () => {
    expect(data.characters['PID_リュール'].startingClass.name).toEqual(
      'Dragon Child'
    );
  });
});
