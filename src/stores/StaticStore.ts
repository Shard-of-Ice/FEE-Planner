import { defineStore } from 'pinia';
import { Character, Class, StatBlock } from './datatypes';

interface StaticStoreState {
  classList: Class[];
  characterList: Character[];
}

function readStatBlocks(url: string) {
  const result: { [name: string]: StatBlock } = {};

  return new Promise<{ [name: string]: StatBlock }>(function (resolve, reject) {
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
        readStatBlocks('../data/class-bases.csv'),
        readStatBlocks('../data/class-growths.csv'),
        readStatBlocks('../data/character-bases.csv'),
        readStatBlocks('../data/character-growths.csv'),
      ]).then((values) => {
        const classBases = values[0];
        const classGrowths = values[1];
        const characterBases = values[2];
        const characterGrowths = values[3];
      });
    },
  },
});
