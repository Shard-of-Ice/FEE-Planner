import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import data from './Data';
import { NumberDict, SkillDict } from 'src/utils/CsvParsing';
import { CharacterStats, WeaponStats } from 'src/models/StatBlock';

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

    expect(strDex1Skill.characterBonus).toEqual(
      new CharacterStats({ str: 1, dex: 1 })
    );
  });
});
