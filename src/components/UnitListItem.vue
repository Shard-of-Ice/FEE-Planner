<template>
  <q-item class="q-pa-none">
    <q-item-section class="q-pa-none">
      <q-img :src="portrait_url" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-big">{{ unit.character.name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { Unit } from 'src/stores/datatypes';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'UnitListItem',
  props: {
    unit: {
      type: Unit,
      required: true,
    },
  },
  setup(props) {
    return {
      portrait_url: computed(() => {
        let char_name_url = props.unit.character.name.toLowerCase();
        if (char_name_url == 'alear') {
          char_name_url += '_f';
        }
        return `img/cropped_portraits/${char_name_url}.png`;
      }),
    };
  },
});
</script>
