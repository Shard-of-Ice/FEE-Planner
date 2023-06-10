import { defineStore } from 'pinia';
import { Character } from 'src/models/Character';
import { Class, ClassTier, ClassType } from 'src/models/Class';
import { StatBlock } from 'src/models/StatBlock';

interface StaticStoreState {
  classes: { [key: string]: Class };
  characters: { [key: string]: Character };
  playableCharacters: string[];
}

function getClassByName(
  className: string,
  state: StaticStoreState,
  characterName: string
) {
  for (const classId in state.classes) {
    const clss = state.classes[classId];
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
  return state.classes[Object.keys(state.classes)[0]];
}

type StringDict = { [key: string]: string };
type StringDictDict = { [id: string]: StringDict };

function readCsv(url: string): Promise<StringDictDict> {
  const result: StringDictDict = {};

  return new Promise<StringDictDict>(function (resolve) {
    // some async operation here
    fetch(url, {
      method: 'get',
      headers: {
        'content-type': 'text/csv;charset=UTF-8',
        //'Authorization': //in case you need authorisation
      },
    })
      .then((data) => data.text())
      .then((text) => {
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
        // resolve the promise with some value
        resolve(result);
      });
  });
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

function classFromDict(data: StringDict): Class {
  return new Class(
    data['ID'],
    data['Name'],
    ClassTier.fromString(data['Class Tier']),
    ClassType.fromString(data['Class Type']),
    statBlockFromDict(data, 'Base '),
    statBlockFromDict(data, '', ' Growth'),
    statBlockFromDict(data, '', ' Cap'),
    data['Flag'].length > 4,
    data['Flag'] == 'Female-only',
    data['Exclusive User']
  );
}

function readAllClasses(data: StringDictDict, state: StaticStoreState) {
  for (const key in data) {
    state.classes[key] = classFromDict(data[key]);
  }
}

function characterFromDict(
  data: StringDict,
  state: StaticStoreState
): Character {
  return new Character(
    data['ID'],
    data['Name'],
    getClassByName(data['Initial Class'], state, data['Name']),
    Number(data['Level']),
    Number(data['Internal Level']),
    Number(data['SP']),
    statBlockFromDict(data, '', ' Base'),
    statBlockFromDict(data, '', ' Growth'),
    statBlockFromDict(data, '', ' Cap+'),
    data['Gender'] == 'Female'
  );
}

function readAllCharacters(data: StringDictDict, state: StaticStoreState) {
  for (const key in data) {
    state.characters[key] = characterFromDict(data[key], state);
    if (state.characters[key].startingSP > 0 && !key.endsWith('竜化')) {
      // The second check is for Nel and Rafal transformed, otherwise they appear 2 times
      state.playableCharacters.push(key);
    }
  }
}

export const useStaticStore = defineStore('static', {
  state: (): StaticStoreState => ({
    classes: {},
    characters: {},
    playableCharacters: [],
  }),

  getters: {
    getAllowedClasses(state: StaticStoreState) {
      return (character: Character) =>
        Object.values(state.classes).filter((clss) =>
          character.canUseClass(clss)
        );
    },
  },

  actions: {
    async loadStaticStore() {
      await Promise.all([
        readCsv('data/classes.csv'),
        readCsv('data/characters.csv'),
      ]).then((values) => {
        readAllClasses(values[0], this);
        readAllCharacters(values[1], this);
      });
    },
  },
});
