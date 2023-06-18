import { Character } from 'src/models/Character';
import { Class, ClassTier, ClassType } from 'src/models/Class';
import { CharacterStats, WeaponStats } from 'src/models/StatBlock';
import {
  Engraving,
  ForgingUpgrade,
  ProficiencyLevel,
  WeaponData,
  WeaponProficiency,
  WeaponType,
} from 'src/models/Weapon';

export type StringDict = { [key: string]: string };
export type StringDictDict = { [id: string]: StringDict };

export type ClassDict = { [key: string]: Class };
export type CharacterDict = { [key: string]: Character };
export type WeaponDataDict = { [key: string]: WeaponData };
export type ForgingUpgradeListDict = { [key: string]: ForgingUpgrade[] };
export type EngravingDict = { [key: string]: Engraving };

export function readCsvFromUrl(url: string): Promise<Iterable<StringDict>> {
  return new Promise<Iterable<StringDict>>(function (resolve) {
    fetch(url, {
      method: 'get',
      headers: {
        'content-type': 'text/csv;charset=UTF-8',
      },
    })
      .then((data) => data.text())
      .then((text) => {
        resolve(readCsv(text));
      });
  });
}

export function* readCsv(text: string): Generator<StringDict> {
  const lines = text.split('\n');
  const header = lines[0].split(';');
  for (const line of lines.slice(1)) {
    if (!(line.startsWith('Name') || line.length < 20)) {
      const values = line.split(';');
      if (values.length == header.length) {
        const lineDict: StringDict = {};
        for (let i = 0; i < header.length; ++i) {
          lineDict[header[i]] = values[i];
        }
        yield lineDict;
      }
    }
  }
}

export function csvToDict(
  data: Iterable<StringDict>,
  keyName = 'ID'
): StringDictDict {
  const result: StringDictDict = {};

  for (const lineDict of data) {
    result[lineDict[keyName]] = lineDict;
  }

  return result;
}

function characterStatsFromDict(
  data: StringDict,
  prefix = '',
  suffix = ''
): CharacterStats {
  return new CharacterStats({
    hp: Number(data[prefix + 'HP' + suffix] ?? '0') || 0,
    str: Number(data[prefix + 'Str' + suffix] ?? '0') || 0,
    mag: Number(data[prefix + 'Mag' + suffix] ?? '0') || 0,
    dex: Number(data[prefix + 'Dex' + suffix] ?? '0') || 0,
    spd: Number(data[prefix + 'Spd' + suffix] ?? '0') || 0,
    def: Number(data[prefix + 'Def' + suffix] ?? '0') || 0,
    res: Number(data[prefix + 'Res' + suffix] ?? '0') || 0,
    lck: Number(data[prefix + 'Lck' + suffix] ?? '0') || 0,
    bld: Number(data[prefix + 'Bld' + suffix] ?? '0') || 0,
    mov: Number(data[prefix + 'Mov' + suffix] ?? '0') || 0,
  });
}

function weaponStatsFromDict(
  data: StringDict,
  prefix = '',
  suffix = ''
): WeaponStats {
  return new WeaponStats({
    might: Number(data[prefix + 'Might' + suffix] ?? '0') || 0,
    hit: Number(data[prefix + 'Hit' + suffix] ?? '0') || 0,
    critical: Number(data[prefix + 'Critical' + suffix] ?? '0') || 0,
    weight: Number(data[prefix + 'Weight' + suffix] ?? '0') || 0,
    avoid: Number(data[prefix + 'Avoid' + suffix] ?? '0') || 0,
    dodge: Number(data[prefix + 'Dodge' + suffix] ?? '0') || 0,
  });
}

function weaponProficienciesFromString(str: string): WeaponProficiency[] {
  if (str.length < 4) {
    return [];
  }
  // else
  return str.split(', ').map(weaponProficiencyFromString);
}

function weaponProficiencyFromString(str: string): WeaponProficiency {
  const splits = str.split(' ');
  if (splits.length === 2) {
    const [typeStr, levelStr] = splits;
    return {
      weaponType: WeaponType.fromString(typeStr),
      level: ProficiencyLevel.fromString(levelStr),
    };
  }
  // else
  console.warn(`Could not parse weapon proficiency : ${str}`);
  return {
    weaponType: WeaponType.None,
    level: ProficiencyLevel.None,
  };
}

function classFromDict(data: StringDict): Class {
  return new Class(
    data['ID'],
    data['Name'],
    ClassTier.fromString(data['Class Tier']),
    ClassType.fromString(data['Class Type']),
    characterStatsFromDict(data, 'Base '),
    characterStatsFromDict(data, '', ' Growth'),
    characterStatsFromDict(data, '', ' Cap'),
    weaponProficienciesFromString(data['Max Weapons']),
    data['Flag'].length > 4,
    data['Flag'] == 'Female-only',
    data['Exclusive User']
  );
}

export function readAllClasses(data: StringDictDict): ClassDict {
  const classes: ClassDict = {};
  for (const key in data) {
    classes[key] = classFromDict(data[key]);
  }
  return classes;
}

function getClassByName(
  className: string,
  classes: ClassDict,
  characterName: string
) {
  for (const classId in classes) {
    const clss = classes[classId];
    // We filter out classes with the same name, but for the wrong character
    if (
      clss.name == className &&
      (clss.exclusiveCharacterName == '' ||
        clss.exclusiveCharacterName == characterName)
    ) {
      return clss;
    }
  }
  // default
  return classes[Object.keys(classes)[0]];
}

function characterFromDict(data: StringDict, classes: ClassDict): Character {
  return new Character(
    data['ID'],
    data['Name'],
    getClassByName(data['Initial Class'], classes, data['Name']),
    Number(data['Level']),
    Number(data['Internal Level']),
    Number(data['SP']),
    characterStatsFromDict(data, '', ' Base'),
    characterStatsFromDict(data, '', ' Growth'),
    characterStatsFromDict(data, '', ' Cap+'),
    data['Gender'] == 'Female'
  );
}

export function readAllCharacters(
  data: StringDictDict,
  classes: ClassDict
): CharacterDict {
  const characters: CharacterDict = {};
  for (const key in data) {
    characters[key] = characterFromDict(data[key], classes);
  }
  return characters;
}

function weaponFromDict(
  data: StringDict,
  forgingUpgrades: ForgingUpgrade[]
): WeaponData {
  return new WeaponData(
    data['ID'],
    data['Name'],
    WeaponType.fromString(data['Type']),
    weaponStatsFromDict(data),
    ProficiencyLevel.fromString(data['Rank']),
    data['Playable'] != '0',
    data['Exclusive User'] || '',
    forgingUpgrades
  );
}

export function readAllWeapons(
  data: StringDictDict,
  forgingUpgrades: ForgingUpgradeListDict
): WeaponDataDict {
  const weapons: WeaponDataDict = {};
  for (const key in data) {
    weapons[key] = weaponFromDict(
      data[key],
      forgingUpgrades[data[key]['Name']] || []
    );
  }
  return weapons;
}

function forgingUpgradeFromDict(data: StringDict): ForgingUpgrade {
  return new ForgingUpgrade(
    Number(data['Upgrade Level']) || 0,
    weaponStatsFromDict(data, '', '+')
  );
}

export function readAllForgingUpgrades(
  data: Iterable<StringDict>
): ForgingUpgradeListDict {
  const forgingUpgrades: ForgingUpgradeListDict = {};

  for (const lineDict of data) {
    const weaponName = lineDict['Base Weapon'];
    const forgingLevel = Number(lineDict['Upgrade Level']);
    if (forgingLevel === 1) {
      // We add level 0 to make our life easier
      forgingUpgrades[weaponName] = [new ForgingUpgrade(0, new WeaponStats())];
    }
    forgingUpgrades[weaponName].push(forgingUpgradeFromDict(lineDict));
  }

  return forgingUpgrades;
}

function engravingFromDict(data: StringDict): Engraving {
  return new Engraving(data['Name'], weaponStatsFromDict(data, '', '+'));
}

export function readAllEngravings(data: StringDictDict): EngravingDict {
  const engravings: EngravingDict = {};
  for (const key in data) {
    engravings[key] = engravingFromDict(data[key]);
  }
  return engravings;
}
