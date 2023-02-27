import { defineStore } from 'pinia';
import { Character, Class, StatBlock } from './datatypes';

interface StaticStoreState {
  classList: Class[];
  characterList: Character[];
}

type StatBlockDict = { [id: string]: StatBlock };

type StringDict = { [key: string]: string };
type StringDictDict = { [id: string]: StringDict };

function readCsv(url: string): Promise<StringDictDict> {
  const result: StringDictDict = {};

  return new Promise<StringDictDict>(function (resolve, reject) {
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

function readStatBlocks(url: string): Promise<StatBlockDict> {
  const result: StatBlockDict = {};

  return new Promise<StatBlockDict>(function (resolve, reject) {
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
        text.split('\n').forEach((line) => {
          if (!(line.startsWith('Name') || line.length < 20)) {
            const fields = line.split(';');
            const name = fields[0];
            const stats = StatBlock.make(
              fields.slice(1).map((s: string): number => parseInt(s))
            );
            result[name] = stats;
          }
        });
        // resolve the promise with some value
        resolve(result);
      });
  });
}

export const useStaticStore = defineStore('static', {
  state: (): StaticStoreState => ({
    classList: [],
    characterList: [],
  }),

  getters: {},

  actions: {
    loadStaticStore() {
      Promise.all([
        readCsv('../data/classes.csv'),
        readCsv('../data/characters.csv'),
      ]).then((values) => {
        const classesRaw = values[0];
        const charactersRaw = values[1];
        console.log(classesRaw);
        console.log(charactersRaw);
      });
      // Promise.all([
      //   readStatBlocks('../data/class-bases.csv'),
      //   readStatBlocks('../data/class-growths.csv'),
      //   readStatBlocks('../data/class-caps.csv'),
      //   readStatBlocks('../data/character-bases.csv'),
      //   readStatBlocks('../data/character-growths.csv'),
      //   readStatBlocks('../data/character-caps.csv'),
      // ]).then((values) => {
      //   const classBases = values[0];
      //   const classGrowths = values[1];
      //   const classCaps = values[2];
      //   const characterBases = values[3];
      //   const characterGrowths = values[4];
      //   const characterCaps = values[5];
      //   console.log(classBases);
      //   console.log(classGrowths);
      //   console.log(classCaps);
      //   console.log(characterBases);
      //   console.log(characterGrowths);
      //   console.log(characterCaps);
      // });
    },
  },
});
