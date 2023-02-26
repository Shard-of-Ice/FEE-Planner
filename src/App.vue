<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStaticStore } from './stores/StaticStore';

export default {
  defineComponent: {
    name: 'App',
  },

  mounted() {
    const staticStore = useStaticStore();
    staticStore.loadStaticStore();
  },
};
</script>
