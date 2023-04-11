import { defineStore } from 'pinia';
import { Unit } from '../utils/datatypes';

interface AppStateStoreState {
  selectedUnit: Unit | null;
}

export const useAppStateStore = defineStore('app-state', {
  state: (): AppStateStoreState => ({
    selectedUnit: null,
  }),

  getters: {},

  actions: {
    async selectUnit(unit: Unit) {
      this.selectedUnit = unit;
    },
  },
});
