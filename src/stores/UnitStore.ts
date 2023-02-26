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

  actions: {},
});
