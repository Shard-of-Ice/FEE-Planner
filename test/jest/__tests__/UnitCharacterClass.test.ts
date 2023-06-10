import { describe, expect, it } from '@jest/globals';
import { CharacterDict, ClassDict } from '../../../src/utils/CsvParsing';
import { beforeAll } from '@jest/globals';
import {
  readAllCharacters,
  readAllClasses,
  readCsv,
} from 'src/utils/CsvParsing';
import { promises as fs } from 'fs';
import { StatBlock } from 'src/models/StatBlock';
import { Unit } from 'src/models/Unit';

interface Idata {
  classes: ClassDict;
  characters: CharacterDict;
}

const data: Idata = {
  classes: {},
  characters: {},
};

beforeAll(() => {
  return Promise.all([
    fs.readFile('public/data/classes.csv'),
    fs.readFile('public/data/characters.csv'),
  ]).then((buffers) => {
    data.classes = readAllClasses(readCsv(buffers[0].toString()));
    data.characters = readAllCharacters(
      readCsv(buffers[1].toString()),
      data.classes
    );
  });
});

describe('Class', () => {
  it('should load classes', () => {
    expect(Object.keys(data.classes).length).toBeGreaterThan(0);
  });
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

  it('should have the right starting stats', () => {
    const alear = data.characters['PID_リュール'];
    const alearUnit = new Unit(alear);
    const alearStats = new StatBlock(22, 6, 0, 5, 7, 5, 3, 5, 4, 4);

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 10 stats', () => {
    const alear = data.characters['PID_リュール'];
    const alearUnit = new Unit(alear, 10);
    const alearStats = new StatBlock(28, 10, 2, 10, 13, 9, 6, 7, 4, 4);

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 10 stats as a mage', () => {
    const alear = data.characters['PID_リュール'];
    const mageClass = data.classes['JID_マージ'];
    const alearUnit = new Unit(alear, 10, mageClass);
    const alearStats = new StatBlock(25, 5, 12, 14, 12, 5, 12, 8, 4, 4);

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 1 (10) stats after promotion', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 1, promotedClass);
    const alearStats = new StatBlock(32, 13, 3, 13, 15, 12, 9, 10, 8, 5);

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 20 (29) stats after promotion', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 20, promotedClass);
    const alearStats = new StatBlock(45, 21, 7, 23, 28, 22, 17, 16, 10, 5);

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should have the right level 20 (48) stats after re-promotion', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 39, promotedClass);
    const alearStats = new StatBlock(58, 30, 11, 34, 40, 33, 24, 23, 11, 5);

    for (const statName in Object.keys(alearStats)) {
      expect(alearUnit.stats.get(statName)).toEqual(alearStats.get(statName));
    }
  });

  it('should never exceed stat caps', () => {
    const alear = data.characters['PID_リュール'];
    const promotedClass = data.classes['JID_神竜ノ王'];
    const alearUnit = new Unit(alear, 99, promotedClass);

    for (const statName of StatBlock.statNames) {
      expect(alearUnit.stats.get(statName)).toBeLessThanOrEqual(
        alearUnit.totalCaps.get(statName)
      );
    }
  });
});
