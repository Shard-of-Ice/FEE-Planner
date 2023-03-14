<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="page-header" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Fire Emblem Engage Planner
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab to="/" label="Page One" />
        <q-route-tab to="/" label="Page Two" />
        <q-route-tab to="/" label="Page Three" />
      </q-tabs>
    </q-header>

    <q-drawer
      ref="leftDrawer"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="background-blue-dark"
    >
      <q-list bordered separator>
        <q-item
          class="q-pa-none q-mx-md q-my-xs background-blue-medium"
          clickable
          v-ripple
          v-for="[index, unit] of unitStore.unitList.entries()"
          :key="index"
          @click="pick(unit)"
        >
          <unit-list-item :unit="unit" class="full-width" />
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container class="dark-page">
      <router-view />
    </q-page-container>

    <q-footer elevated class="page-footer text-white">
      <q-toolbar> </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { computed, ref, Ref } from 'vue';
import { useUnitStore } from 'src/stores/UnitStore';
import { useAppStateStore } from 'src/stores/AppStateStore';
import { Unit } from 'src/stores/datatypes';
import UnitListItem from '../components/UnitListItem.vue';
import { QDrawer } from 'quasar';

export default {
  components: { UnitListItem },

  setup() {
    const unitStore = useUnitStore();
    const appStateStore = useAppStateStore();

    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);

    const leftDrawer: Ref<QDrawer | null> = ref(null);

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    function toggleRightDrawer() {
      rightDrawerOpen.value = !rightDrawerOpen.value;
    }

    const mobileMode = computed(
      () =>
        leftDrawer.value &&
        leftDrawer.value.breakpoint &&
        leftDrawer.value.breakpoint > window.innerWidth
    );

    return {
      unitStore,
      leftDrawer,

      mobileMode,

      leftDrawerOpen,
      toggleLeftDrawer,

      rightDrawerOpen,
      toggleRightDrawer,

      pick(unit: Unit) {
        appStateStore.selectUnit(unit);
        if (mobileMode.value) {
          toggleLeftDrawer();
        }
      },
    };
  },
};
</script>
