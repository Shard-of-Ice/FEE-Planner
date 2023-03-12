<template>
  <q-page class="column items-start">
    <div class="col-2" v-if="unit">
      <h2>{{ unit.character.name }}</h2>
      <q-select
        outlined
        v-model="unit.class"
        :options="allowedClasses"
        :option-label="
          (c) => (Object(c) === c && 'name' in c ? c.name : '- Null -')
        "
        label="Class"
      />
      <p>{{ unit.class.type.name }}</p>
      <div class="row justify-between full-width">
        <q-select
          outlined
          class="col-6"
          v-model="unit.level"
          :options="allowedLevels"
          :option-label="
            (l) =>
              '' +
              l +
              ' (' +
              ((unit?.totalLevel || 1) - (unit?.level || 1) + l) +
              ')'
          "
          label="Level"
        />
        <p class="col-2">Mov</p>
        <p class="col-1 text-right">{{ unit.stats.mov }}</p>
      </div>
      <p>HP {{ unit.stats.hp }} / {{ unit.stats.hp }}</p>
      <p>Bld {{ unit.stats.bld }}</p>
      <p>SP {{ unit.sp }}</p>
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

<script lang="ts">
import { computed, ComputedRef } from 'vue';
import { useAppStateStore } from 'src/stores/AppStateStore';
import { useStaticStore } from 'src/stores/StaticStore';
import { Unit } from 'src/stores/datatypes';

export default {
  setup() {
    const appStateStore = useAppStateStore();
    const staticStore = useStaticStore();

    const unit: ComputedRef<Unit | null> = computed(
      () => appStateStore.selectedUnit
    );

    return {
      unit,
      basicStats: computed(() => {
        return {
          Str: unit.value?.stats.str || 0,
          Mag: unit.value?.stats.mag || 0,
          Dex: unit.value?.stats.dex || 0,
          Spd: unit.value?.stats.spd || 0,
          Def: unit.value?.stats.def || 0,
          Res: unit.value?.stats.res || 0,
          Lck: unit.value?.stats.lck || 0,
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
      allowedClasses: computed(() =>
        Object.values(staticStore.classes).filter(
          (clss) => unit.value && unit.value.character.canUseClass(clss)
        )
      ),
      allowedLevels: computed(() => {
        let min = 1;
        let max = unit.value?.class.tier.maxLevel || 1;
        if (
          unit.value &&
          unit.value.class == unit.value.character.startingClass
        ) {
          min = unit.value?.character.startingLevel;
        }
        return Array.from({ length: max - min + 1 }, (_, i) => min + i);
      }),
    };
  },
};
</script>

<style></style>
