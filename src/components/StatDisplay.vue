<template>
  <div class="row justify-between full-width">
    <div class="col-5 stats-label">{{ statName }}</div>
    <div class="col-5 text-right stats-value">
      <span v-if="statName == 'HP'">{{ statValue }}/</span>
      <span
        :class="
          bonusValue > 0
            ? 'text-info'
            : bonusValue < 0
            ? 'text-red-5'
            : statValue == maxValue
            ? 'text-positive'
            : ''
        "
        >{{ statValue }}</span
      >
    </div>
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
      type: Number,
      required: true,
    },
    bonusValue: {
      type: Number,
      default: 0,
    },
    maxValue: {
      type: Number,
      default: -1,
    },
  },
});
</script>
