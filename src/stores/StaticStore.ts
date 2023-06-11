import { defineStore } from 'pinia';
import { Character } from 'src/models/Character';
import {
  CharacterDict,
  ClassDict,
  WeaponDict,
  readAllCharacters,
  readAllClasses,
  readAllWeapons,
  readCsvFromUrl,
} from 'src/utils/CsvParsing';

interface StaticStoreState {
  classes: ClassDict;
  characters: CharacterDict;
  playableCharacters: string[];
  weapons: WeaponDict;
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
    weapons: {},
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
        readCsvFromUrl('data/weapons.csv'),
      ]).then((values) => {
        this.classes = readAllClasses(values[0]);
        this.characters = readAllCharacters(values[1], this.classes);
        this.playableCharacters = Object.keys(this.characters).filter((key) =>
          isPlayable(key, this.characters[key])
        );
        this.weapons = readAllWeapons(values[2]);
      });
    },
  },
});
