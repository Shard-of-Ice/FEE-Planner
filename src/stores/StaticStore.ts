import { defineStore } from 'pinia';
import { Character, Class } from './datatypes';

interface StaticStoreState {
  classList: Class[];
  characterList: Character[];
}

export const useStaticStore = defineStore('static', {
  state: (): StaticStoreState => ({
    classList: [],
    characterList: [],
  }),

  getters: {},

  actions: {},
});
