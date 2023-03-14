<template>
  <div class="row justify-between full-width">
    <div class="col-5 stats-label">{{ statName }}</div>
    <div class="col-5 text-right stats-value">{{ statValue }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StatDisplay',
  props: {
    statName: {
      type: String,
      required: true,
    },
    statValue: {
      type: String,
      required: true,
    },
  },
});
</script>
