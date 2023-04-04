import { defineStore } from 'pinia';
import { useUnitStore } from './UnitStore';
import { StatBlock, Unit } from './datatypes';

type SingleStatRanking = { [key: number]: number };
type MultipleStatRanking = { [key: string]: SingleStatRanking };

interface RankingsStoreState {
  rankings: MultipleStatRanking;
}

function addStatsToRankings(state: RankingsStoreState, stats: StatBlock) {
  for (const statName of StatBlock.statNames) {
    if (!state.rankings[statName]) {
      state.rankings[statName] = {};
    }
    if (!state.rankings[statName][stats.get(statName)]) {
      state.rankings[statName][stats.get(statName)] = 0;
    }
    state.rankings[statName][stats.get(statName)]++;
  }
}

function addUnitToRankings(state: RankingsStoreState, unit: Unit) {
  return addStatsToRankings(state, unit.stats);
}

function calculateRankingsInTeam(state: RankingsStoreState) {
  const unitStore = useUnitStore();
  for (const unit of unitStore.unitList) {
    addUnitToRankings(state, unit);
  }
}

export const useRankingsStore = defineStore('rankings', {
  state: (): RankingsStoreState => ({
    rankings: {},
  }),

  getters: {},

  actions: {
    async calculateStats() {
      calculateRankingsInTeam(this);
    },
  },
});
