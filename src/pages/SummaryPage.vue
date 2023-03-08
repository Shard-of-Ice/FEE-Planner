<template>
  <q-page class="column items-start">
    <div class="col-2" v-if="unit">
      <h2>{{ unit.character.name }}</h2>
      <p>{{ unit.class.name }}</p>
      <p>{{ unit.class.type.name }}</p>
      <div class="row justify-between full-width">
        <p class="col-2">Level</p>
        <p class="col-1 text-right">{{ unit.level }}</p>
        <p class="col-2">Mov</p>
        <p class="col-1 text-right">{{ unit.stats.mov }}</p>
      </div>
      <p>HP {{ unit.stats.hp }} / {{ unit.stats.hp }}</p>
      <p>Bld {{ unit.stats.bld }}</p>
      <p>SP {{ unit.stats.sp }}</p>
      <h3>Combat Stats</h3>
      <template v-for="(statValue, statName) in combatStats" :key="statName">
        <div class="row justify-between full-width">
          <div class="col-3">{{ statName }}</div>
          <div class="col-1 text-right">{{ statValue }}</div>
        </div>
      </template>
      <h3>Basic Stats</h3>
      <template v-for="(statValue, statName) in basicStats" :key="statName">
        <div class="row justify-between full-width">
          <div class="col-3">{{ statName }}</div>
          <div class="col-1 text-right">{{ statValue }}</div>
        </div>
      </template>
      <p>Rating {{ unit.stats.rating }}</p>
    </div></q-page
  >
</template>

<script>
import { computed } from 'vue';
import { useAppStateStore } from 'src/stores/AppStateStore';

export default {
  setup() {
    const appStateStore = useAppStateStore();

    return {
      unit: computed(() => appStateStore.selectedUnit),
      basicStats: computed(() => {
        return {
          Str: appStateStore.selectedUnit.stats.str,
          Mag: appStateStore.selectedUnit.stats.mag,
          Dex: appStateStore.selectedUnit.stats.dex,
          Spd: appStateStore.selectedUnit.stats.spd,
          Def: appStateStore.selectedUnit.stats.def,
          Res: appStateStore.selectedUnit.stats.res,
          Lck: appStateStore.selectedUnit.stats.lck,
        };
      }),
      combatStats: computed(() => {
        return {
          Atk: 0,
          Hit: 0,
          Avo: 0,
          Crit: 0,
          Ddg: 0,
        };
      }),
    };
  },
};
</script>

<style></style>
