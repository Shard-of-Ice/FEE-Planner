import { useStaticStore } from './StaticStore';
import { defineStore } from 'pinia';
import { Unit } from './datatypes';

interface UnitStoreState {
  unitList: Unit[];
}

export const useUnitStore = defineStore('unit', {
  state: (): UnitStoreState => ({
    unitList: [],
  }),

  getters: {},

  actions: {
    loadDefaultTeam() {
      const staticStore = useStaticStore();

      for (const key of staticStore.playableCharacters) {
        const character = staticStore.characters[key];
        this.unitList.push(new Unit(character));
      }
    },
  },
});
