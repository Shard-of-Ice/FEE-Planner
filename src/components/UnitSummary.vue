<template>
  <div class="col-auto column" v-if="unit">
    <div class="stats-column q-pa-sm" />
    <div class="character-name-header">
      <h2 class="col-3 character-name-text q-mx-md">
        {{ unit.character.name }}
      </h2>
    </div>
    <div class="col stats-column">
      <div class="column background-blue-gray text-medium q-my-md q-px-md">
        <q-select
          class="q-mb-sm"
          dark
          dense
          v-model="unit.class"
          :options="allowedClasses"
          :option-label="
            (c) => (Object(c) === c && 'name' in c ? c.name : '- Null -')
          "
        />
        <div>{{ unit.class.type.name }}</div>
        <div class="row justify-between items-baseline full-width">
          <div class="col-2">Lvl</div>
          <q-select
            dark
            dense
            class="col-5 q-mb-sm"
            v-model="unit.level"
            :options="allowedLevels"
            :option-label="
              (l) =>
                '' +
                (l <= (unit?.class.tier.maxLevel || 20) ? l : l - 19) +
                ' (' +
                ((unit?.totalLevel || 1) - (unit?.level || 1) + l) +
                ')'
            "
          />
          <div class="col-1" />
          <div class="col-2">Mov</div>
          <div class="col-2 text-right">{{ unit.stats.mov }}</div>
        </div>
      </div>
      <div class="column q-px-md">
        <stat-display
          stat-name="HP"
          :stat-value="unit.stats.hp"
          :max-value="unit.totalCaps.hp"
        />
        <stat-display
          stat-name="Bld"
          :stat-value="unit.stats.bld"
          :max-value="unit.totalCaps.bld"
        />
        <stat-display stat-name="SP" :stat-value="unit.sp" />
        <h3 class="stats-header">Combat Stats</h3>
        <stat-display
          v-for="(statValue, statName) in combatStats"
          :key="statName"
          :stat-name="statName"
          :stat-value="statValue || 0"
        />
        <h3 class="stats-header">Basic Stats</h3>
        <stat-display
          v-for="(statValue, statName) in basicStats"
          :key="statName"
          :stat-name="statName"
          :stat-value="unit.stats.get(statName)"
          :max-value="unit.totalCaps.get(statName)"
        />
        <stat-display
          class="q-mt-sm"
          stat-name="Rating"
          :stat-value="unit.stats.rating"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ComputedRef } from 'vue';
import { useAppStateStore } from 'src/stores/AppStateStore';
import { useStaticStore } from 'src/stores/StaticStore';
import { ClassTier, Unit } from 'src/utils/datatypes';
import StatDisplay from 'src/components/StatDisplay.vue';

export default defineComponent({
  name: 'UnitSummary',
  components: { StatDisplay },

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
          Atk: unit.value?.atk || 0,
          Hit: unit.value?.hit || 0,
          Avo: unit.value?.avo || 0,
          Crit: unit.value?.crit || 0,
          Ddg: unit.value?.ddg || 0,
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
        if (!unit.value?.class.tier.equals(ClassTier.Base)) {
          // 19 extra levels from reclassing into the same class
          max += 19;
        }
        if (
          unit.value &&
          unit.value.class == unit.value.character.startingClass
        ) {
          min = unit.value?.character.startingLevel;
        }
        return Array.from({ length: max - min + 1 }, (_, i) => min + i);
      }),
      bust_url: computed(() => {
        let char_name_url = unit.value?.character.name;
        if (char_name_url == 'Alear') {
          char_name_url += '_male';
        }
        return `img/busts/${char_name_url}.png`;
      }),
    };
  },
});
</script>

<style></style>
