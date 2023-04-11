<template>
  <router-view />
</template>

<script lang="ts">
import { useStaticStore } from './stores/StaticStore';
import { useUnitStore } from './stores/UnitStore';
import { useRankingsStore } from './stores/RankingsStore';
import { useRoute, useRouter } from 'vue-router';

export default {
  defineComponent: {
    name: 'App',
  },

  async mounted() {
    const route = useRoute();
    const router = useRouter();

    const staticStore = useStaticStore();
    const unitStore = useUnitStore();
    const rankingsStore = useRankingsStore();

    await staticStore.loadStaticStore();
    await router.isReady(); // needed to use route.query
    if ('team' in route.query) {
      unitStore.loadTeamFromBase64(String(route.query.team));
    } else {
      unitStore.loadDefaultTeam();
    }
    //rankingsStore.calculateStats();
  },
};
</script>
