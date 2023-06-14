import { defineStore } from 'pinia';
import { Character } from 'src/models/Character';
import {
  CharacterDict,
  ClassDict,
  EngravingDict,
  WeaponDataDict,
  csvToDict,
  readAllCharacters,
  readAllClasses,
  readAllEngravings,
  readAllForgingUpgrades,
  readAllWeapons,
  readCsvFromUrl,
} from 'src/utils/CsvParsing';

interface StaticStoreState {
  classes: ClassDict;
  characters: CharacterDict;
  playableCharacters: string[];
  weapons: WeaponDataDict;
  engravings: EngravingDict;
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
    engravings: {},
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
      const [classes, characters, weapons, forging, engravings] =
        await Promise.all([
          readCsvFromUrl('data/classes.csv'),
          readCsvFromUrl('data/characters.csv'),
          readCsvFromUrl('data/weapons.csv'),
          readCsvFromUrl('data/forging.csv'),
          readCsvFromUrl('data/engravings.csv'),
        ]);

      this.classes = readAllClasses(csvToDict(classes));
      this.characters = readAllCharacters(csvToDict(characters), this.classes);
      this.playableCharacters = Object.keys(this.characters).filter((key) =>
        isPlayable(key, this.characters[key])
      );
      const forgingUpgrades = readAllForgingUpgrades(forging);
      this.weapons = readAllWeapons(csvToDict(weapons), forgingUpgrades);
      this.engravings = readAllEngravings(csvToDict(engravings));
    },
  },
});
