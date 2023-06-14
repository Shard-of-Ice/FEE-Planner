import { Character } from 'src/models/Character';
import { Class, ClassTier, ClassType } from 'src/models/Class';
import { StatBlock } from 'src/models/StatBlock';
import {
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

export function readCsvFromUrl(url: string): Promise<StringDictDict> {
  return new Promise<StringDictDict>(function (resolve) {
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

export function readCsv(text: string): StringDictDict {
  const result: StringDictDict = {};

  const lines = text.split('\n');
  const header = lines[0].split(';');
  lines.slice(1).forEach((line) => {
    if (!(line.startsWith('Name') || line.length < 20)) {
      const values = line.split(';');
      if (values.length == header.length) {
        const lineDict: StringDict = {};
        for (let i = 0; i < header.length; ++i) {
          lineDict[header[i]] = values[i];
        }
        result[lineDict['ID']] = lineDict;
      }
    }
  });

  return result;
}

function statBlockFromDict(
  data: StringDict,
  prefix = '',
  suffix = ''
): StatBlock {
  return new StatBlock(
    Number(data[prefix + 'HP' + suffix] ?? '0'),
    Number(data[prefix + 'Str' + suffix] ?? '0'),
    Number(data[prefix + 'Mag' + suffix] ?? '0'),
    Number(data[prefix + 'Dex' + suffix] ?? '0'),
    Number(data[prefix + 'Spd' + suffix] ?? '0'),
    Number(data[prefix + 'Def' + suffix] ?? '0'),
    Number(data[prefix + 'Res' + suffix] ?? '0'),
    Number(data[prefix + 'Lck' + suffix] ?? '0'),
    Number(data[prefix + 'Bld' + suffix] ?? '0'),
    Number(data[prefix + 'Mov' + suffix] ?? '0')
  );
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
    statBlockFromDict(data, 'Base '),
    statBlockFromDict(data, '', ' Growth'),
    statBlockFromDict(data, '', ' Cap'),
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
    statBlockFromDict(data, '', ' Base'),
    statBlockFromDict(data, '', ' Growth'),
    statBlockFromDict(data, '', ' Cap+'),
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

function weaponFromDict(data: StringDict): WeaponData {
  return new WeaponData(
    data['ID'],
    data['Name'],
    WeaponType.fromString(data['Type']),
    Number(data['Might']),
    Number(data['Hit']),
    Number(data['Critical']),
    Number(data['Weight']),
    Number(data['Avoid']),
    Number(data['Dodge']),
    ProficiencyLevel.fromString(data['Rank']),
    data['Playable'] != '0',
    data['Exclusive User'] || ''
  );
}

export function readAllWeapons(data: StringDictDict): WeaponDataDict {
  const weapons: WeaponDataDict = {};
  for (const key in data) {
    weapons[key] = weaponFromDict(data[key]);
  }
  return weapons;
}
