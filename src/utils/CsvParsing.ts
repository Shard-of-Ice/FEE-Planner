import { Character } from 'src/models/Character';
import { Class, ClassTier, ClassType } from 'src/models/Class';
import { StatBlock } from 'src/models/StatBlock';
import {
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

function weaponFromDict(
  data: StringDict,
  forgingUpgrades: ForgingUpgrade[]
): WeaponData {
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
    Number(data['Might+']) || 0,
    Number(data['Weight+']) || 0,
    Number(data['Hit+']) || 0,
    Number(data['Critical+']) || 0
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
      forgingUpgrades[weaponName] = [new ForgingUpgrade(0, 0, 0, 0, 0)];
    }
    forgingUpgrades[weaponName].push(forgingUpgradeFromDict(lineDict));
  }

  return forgingUpgrades;
}
