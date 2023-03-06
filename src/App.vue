<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStaticStore } from './stores/StaticStore';
import { useUnitStore } from './stores/UnitStore';

export default {
  defineComponent: {
    name: 'App',
  },

  mounted() {
    const staticStore = useStaticStore();
    const unitStore = useUnitStore();
    staticStore.loadStaticStore().then(() => {
      unitStore.loadDefaultTeam();
    });
  },
};
</script>
