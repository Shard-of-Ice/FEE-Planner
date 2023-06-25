<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="page-header" height-hint="98">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
          class="lt-md"
        />

        <q-toolbar-title>
          <img
            src="img/misc/Fire_Emblem_logo.png"
            style="
              height: 40px;
              filter: invert(1);
              margin-right: -180px;
              margin-top: 5px;
            "
          />
          Engage Planner
        </q-toolbar-title>

        <div class="text-blue-grey-3 text-italic text-big">V1.2</div>

        <!-- <q-btn dense flat round icon="menu" @click="toggleRightDrawer" /> -->
      </q-toolbar>

      <!-- <q-tabs align="center">
        <q-route-tab to="/" label="Page One" />
        <q-route-tab to="/" label="Page Two" />
        <q-route-tab to="/" label="Page Three" />
      </q-tabs> -->
    </q-header>

    <q-drawer
      ref="leftDrawer"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="background-blue-dark"
    >
      <q-scroll-area
        class="fit"
        :thumb-style="{
          right: '3px',
          borderRadius: '3px',
          background: 'white',
          width: '10px',
        }"
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
      </q-scroll-area>
    </q-drawer>

    <!-- <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
    </q-drawer> -->

    <q-page-container class="dark-page">
      <router-view />
    </q-page-container>

    <q-footer
      elevated
      class="page-footer text-white q-py-sm q-px-md text-right"
    >
      <p class="q-ma-none" v-if="$q.screen.lt.md">
        <span class="q-mr-sm"
          >Submit feedback :
          <a class="text-white" href="mailto:contact@feplanner.com"
            >contact@feplanner.com</a
          >
        </span>
        <br v-if="$q.screen.lt.sm" />
        <span>Thanks to VincentASM co-contributors for the data.</span>
      </p>
      <p class="q-ma-none" v-else>
        <span class="q-mr-sm"
          >You can submit feedback at
          <a class="text-white" href="mailto:contact@feplanner.com"
            >contact@feplanner.com</a
          >.</span
        >
        <span
          >Thanks to VincentASM and their co-contributors who provided the
          data.</span
        >
      </p>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { ref, Ref } from 'vue';
import { useUnitStore } from 'src/stores/UnitStore';
import { useAppStateStore } from 'src/stores/AppStateStore';
import { Unit } from 'src/models/Unit';
import UnitListItem from '../components/UnitListItem.vue';
import { QDrawer, useQuasar } from 'quasar';

export default {
  components: { UnitListItem },

  setup() {
    const $q = useQuasar();
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

    return {
      unitStore,
      leftDrawer,

      leftDrawerOpen,
      toggleLeftDrawer,

      rightDrawerOpen,
      toggleRightDrawer,

      pick(unit: Unit) {
        appStateStore.selectUnit(unit);
        if ($q.screen.lt.md) {
          toggleLeftDrawer();
        }
      },
    };
  },
};
</script>
