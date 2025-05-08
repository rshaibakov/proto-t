<script setup lang="ts">
import { computed } from 'vue'

type TActivityProgressProps = {
  max: number
  value: number
}

const props = defineProps<TActivityProgressProps>()

const percent = computed(() => Math.round(props.value / (props.max / 100)))
</script>

<template>
  <label class="progress">
    <span>
      Прогресс: <span class="percent">{{ percent }}%</span> <span class="days">({{ value }} из {{max}} дней)</span>
    </span>

    <progress :max="max" :value="value" class="bar"></progress>
  </label>
</template>

<style scoped>
.progress {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  font-size: clamp(1rem, 2cqw, 1.115rem);
}

.percent {
  color: var(--pico-color-blue-500);
  font-weight: 700;
}

.days {
  color: var(--pico-color-slate-600);
}

.bar {
  height: 1rem;
  border-radius: var(--border-radius-round);
}

.bar[value]::-webkit-progress-value {
  background-color: var(--pico-color-blue-500);
}
</style>