import { defineStore } from 'pinia';
import { Character } from 'src/models/Character';
import { Class } from 'src/models/Class';
import {
  readAllCharacters,
  readAllClasses,
  readCsvFromUrl,
} from 'src/utils/CsvParsing';

interface StaticStoreState {
  classes: { [key: string]: Class };
  characters: { [key: string]: Character };
  playableCharacters: string[];
}

function isPlayable(key: string, character: Character) {
  // The second check is for Nel and Rafal transformed, otherwise they appear 2 times
  return character.startingSP > 0 && !key.endsWith('竜化');
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
        readCsvFromUrl('data/classes.csv'),
        readCsvFromUrl('data/characters.csv'),
      ]).then((values) => {
        this.classes = readAllClasses(values[0]);
        this.characters = readAllCharacters(values[1], this.classes);
        this.playableCharacters = Object.keys(this.characters).filter((key) =>
          isPlayable(key, this.characters[key])
        );
      });
    },
  },
});
