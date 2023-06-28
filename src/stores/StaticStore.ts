import { defineStore } from 'pinia';
import { Character } from 'src/models/Character';
import {
  CharacterDict,
  ClassDict,
  EmblemDict,
  EngravingDict,
  SkillDict,
  WeaponDataDict,
  readAll,
} from 'src/utils/CsvParsing';

interface StaticStoreState {
  classes: ClassDict;
  characters: CharacterDict;
  playableCharacters: string[];
  weapons: WeaponDataDict;
  engravings: EngravingDict;
  emblems: EmblemDict;
  skills: SkillDict;
}

function isPlayable(key: string, character: Character) {
  // The second check is for Nel and Rafal transformed, otherwise they appear 2 times
  return character.startingSP > 0 && !key.endsWith('竜化');
}

function readFileFromUrl(url: string) {
  return fetch(url, {
    method: 'get',
    headers: {
      'content-type': 'text/csv;charset=UTF-8',
    },
  }).then((data) => data.text());
}

export const useStaticStore = defineStore('static', {
  state: (): StaticStoreState => ({
    classes: {},
    characters: {},
    playableCharacters: [],
    weapons: {},
    engravings: {},
    emblems: {},
    skills: {},
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
      const [classes, characters, weapons, forging, engravings, bonds, skills] =
        await Promise.all([
          readFileFromUrl('data/classes.csv'),
          readFileFromUrl('data/characters.csv'),
          readFileFromUrl('data/weapons.csv'),
          readFileFromUrl('data/forging.csv'),
          readFileFromUrl('data/engravings.csv'),
          readFileFromUrl('data/bonds.csv'),
          readFileFromUrl('data/skills.csv'),
        ]);

      [
        this.classes,
        this.characters,
        this.weapons,
        this.engravings,
        this.emblems,
        this.skills,
      ] = readAll(
        classes,
        characters,
        weapons,
        forging,
        engravings,
        bonds,
        skills
      );
      this.playableCharacters = Object.keys(this.characters).filter((key) =>
        isPlayable(key, this.characters[key])
      );
    },
  },
});
