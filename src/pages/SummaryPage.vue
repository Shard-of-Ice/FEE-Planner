<template>
  <q-page class="row">
    <unit-summary />
    <div
      class="col column"
      style="overflow-x: hidden; margin-left: -20px"
      v-if="unit"
    >
      <div class="col row items-end" v-if="unit">
        <q-img
          fit="contain"
          position="0% 0%"
          class="col"
          style="height: 70vh; width: 3000px"
          :src="bust_url"
        />
      </div>
    </div>
    <div class="col column self-center items-center" v-else>
      <div class="row items-end" style="font-size: 42px; opacity: 0.1">
        <img
          src="img/misc/Fire_Emblem_logo.png"
          style="
            height: 80px;
            filter: invert(1);
            margin-right: -350px;
            margin-bottom: 10px;
          "
        />
        Engage Planner
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, ComputedRef } from 'vue';
import { useAppStateStore } from 'src/stores/AppStateStore';
import { Unit } from 'src/utils/datatypes';
import UnitSummary from 'src/components/UnitSummary.vue';

export default {
  components: { UnitSummary },

  setup() {
    const appStateStore = useAppStateStore();

    const unit: ComputedRef<Unit | null> = computed(
      () => appStateStore.selectedUnit
    );

    return {
      unit,
      bust_url: computed(() => {
        let char_name_url = unit.value?.character.name;
        if (char_name_url == 'Alear') {
          char_name_url += '_male';
        }
        return `img/busts/${char_name_url}.png`;
      }),
    };
  },
};
</script>

<style></style>
