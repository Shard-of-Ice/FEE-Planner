import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import data from './Data';
import { NumberDict, SkillDict } from 'src/utils/CsvParsing';
import { CharacterStats, WeaponStats } from 'src/models/StatBlock';
import { Unit } from 'src/models/Unit';

beforeAll(() => {
  return data.loadFromDisk();
});

describe('Skill', () => {
  it('should load', () => {
    expect(Object.keys(data.skills).length).toBeGreaterThan(0);
  });

  it('should load basic character bonuses', () => {
    const characterBonusSkills: SkillDict = {
      hp: data.skills['SID_ＨＰ＋５'],
      str: data.skills['SID_力＋１'],
      dex: data.skills['SID_技＋１'],
      spd: data.skills['SID_速さ＋１'],
      lck: data.skills['SID_幸運＋２'],
      def: data.skills['SID_守備＋１'],
      mag: data.skills['SID_魔力＋２'],
      res: data.skills['SID_魔防＋２'],
      bld: data.skills['SID_体格＋３'],
      mov: data.skills['SID_移動＋１'],
    };

    const amount: NumberDict = {
      hp: 5,
      str: 1,
      dex: 1,
      spd: 1,
      lck: 2,
      def: 1,
      mag: 2,
      res: 2,
      bld: 3,
      mov: 1,
    };

    for (const stat of Object.keys(characterBonusSkills)) {
      const skill = characterBonusSkills[stat];
      expect(skill.characterBonus).toEqual(
        new CharacterStats({ [stat]: amount[stat] })
      );
    }
  });

  it('should load basic combat bonuses', () => {
    const weaponBonusSkills: SkillDict = {
      avoid: data.skills['SID_回避＋１０'],
      hit: data.skills['SID_命中＋１０'],
      dodge: data.skills['SID_必殺回避＋１０'],
    };

    for (const stat of Object.keys(weaponBonusSkills)) {
      const skill = weaponBonusSkills[stat];
      expect(skill.weaponBonus).toEqual(new WeaponStats({ [stat]: 10 }));
    }
  });

  it('should load multiple bonuses', () => {
    const strDex1Skill = data.skills['SID_力・技＋１'];
    const knifePrecision1 = data.skills['SID_短剣術１'];

    expect(strDex1Skill.characterBonus).toEqual(
      new CharacterStats({ str: 1, dex: 1 })
    );
    expect(knifePrecision1.weaponBonus).toEqual(
      new WeaponStats({ hit: 3, avoid: 3 })
    );
  });

  it('should always activate if condition is always', () => {
    const hp5Skill = data.skills['SID_ＨＰ＋５'];
    const alearUnit = new Unit(data.characters['PID_リュール']);
    expect(hp5Skill.activationCondition.isFulfilled(alearUnit)).toBeTruthy();
  });

  it('should never activate if condition is never', () => {
    const neverSkills: SkillDict = {
      'Dignity of Solm': data.skills['SID_王の尊厳'],
      Rivalry: data.skills['SID_負けず嫌い'],
      'Rally Spectrum': data.skills['SID_七色の叫び'],
      'Spur Attack': data.skills['SID_絆の指輪_アルフォンス'],
      Battlewise: data.skills['SID_百戦練磨'],
      Hobble: data.skills['SID_足狙い'],
      'No Distractions': data.skills['SID_集中'],
      'Fell Protection': data.skills['SID_邪竜の救済'],
      'Racket of Solm': data.skills['SID_ソルムの騒音'],
      Speedtaker: data.skills['SID_速さの吸収'],
    };
    const alearUnit = new Unit(data.characters['PID_リュール']);
    for (const skillName in neverSkills) {
      const skill = neverSkills[skillName];
      expect(skill.activationCondition.isFulfilled(alearUnit)).toBeFalsy();
    }
  });

  it('should activate depending on weapon type', () => {
    const swordAgility1 = data.skills['SID_剣術・柔１'];
    const alearUnit = new Unit(data.characters['PID_リュール']);
    const ironSword = data.weapons['IID_鉄の剣'];
    const ironLance = data.weapons['IID_鉄の槍'];
    // No weapon
    expect(
      swordAgility1.activationCondition.isFulfilled(alearUnit)
    ).toBeFalsy();
    // Good weapon
    alearUnit.weapon.data = ironSword;
    expect(
      swordAgility1.activationCondition.isFulfilled(alearUnit)
    ).toBeTruthy();
    // Bad weapon
    alearUnit.weapon.data = ironLance;
    expect(
      swordAgility1.activationCondition.isFulfilled(alearUnit)
    ).toBeFalsy();
  });
});
