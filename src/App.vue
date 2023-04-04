<template>
  <router-view />
</template>

<script lang="ts">
import { useStaticStore } from './stores/StaticStore';
import { useUnitStore } from './stores/UnitStore';
import { useRankingsStore } from './stores/RankingsStore';

export default {
  defineComponent: {
    name: 'App',
  },

  mounted() {
    const staticStore = useStaticStore();
    const unitStore = useUnitStore();
    const rankingsStore = useRankingsStore();
    staticStore.loadStaticStore().then(() => {
      unitStore.loadDefaultTeam();
      //rankingsStore.calculateStats();
    });
  },
};
</script>
