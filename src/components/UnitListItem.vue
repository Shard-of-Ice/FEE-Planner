<template>
  <q-item class="q-pa-none">
    <q-item-section avatar class="q-pa-none q-ml-md">
      <q-img
        src="https://cdn.fireemblemwiki.org/thumb/5/5a/FEE_Alear_male_portrait.png/97px-FEE_Alear_male_portrait.png"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label class="q-ma-md">{{ unit.character.name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { Unit } from 'src/stores/datatypes';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UnitListItem',
  props: {
    unit: {
      type: Unit,
      required: true,
    },

    icon: {
      type: String,
      default: '',
    },
  },
});
</script>
