
<template>
  <label
    class="day"
    :data-out-of-month="outOfMonth"
  >
    <template v-if="!outOfMonth">
      <input
        v-for="dayStatus in dayStatuses"
        v-model="status"
        :key="dayStatus"
        type="radio"
        class="field"
        :name="fieldName"
        :value="dayStatus"
      />
    </template>

    <span class="label">
      {{ label }}
    </span>

    <small
      v-if="subLabel"
      class="sub-label"
    >
      {{ subLabel }}
    </small>
  </label>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { dayStatuses } from './const';
import type { TDayStatus } from './types';

type TDayProps = {
  label: string | number
  subLabel?: string
  outOfMonth?: boolean
}

defineProps<TDayProps>()

const fieldName = useId()
const status = defineModel<TDayStatus>('status', { default: 'idle' })
</script>

<style scoped>
.day {
  margin: 0;
  text-align: center;
  cursor: pointer;
  position: relative;
  width: auto;
  padding-block: var(--space-md);
  padding-inline: var(--space-md);
  border-radius: var(--pico-border-radius);
}

@media(hover: hover) {
  .day:hover {
    background-color: var(--pico-contrast-background);
    color: var(--pico-contrast-inverse);
  }
}

.day:is([data-out-of-month="true"]) {
  color: light-dark(var(--pico-color-slate-400), var(--pico-color-slate-700));
}

.day:has(.field:is([value="done"]):checked) {
  background-color: var(--pico-color-green-450);
  color: var(--pico-color-green-50);
}

@media(hover: hover) {
  .day:has(.field:is([value="done"]):checked):hover {
    background-color: var(--pico-color-green-600);
    color: var(--pico-color-green-50);
  }
}


.day:has(.field:is([value="failed"]):checked) {
  background-color: var(--pico-color-pink-500);
  color: var(--pico-color-pink-50);
}

@media(hover: hover) {
  .day:has(.field:is([value="failed"]):checked):hover {
    background-color: var(--pico-color-pink-450);
    color: var(--pico-color-pink-50);
  }
}

.label {
  position: relative;
  z-index: 1;
}

.sub-label {
  position: absolute;
  display: inline-block;
  inset-block-end: 0;
  inset-inline-start: 0;
  width: 100%;
  font-size: 10px;
  text-align: center;
  color: var(--pico-muted-color);
}

.field {
  position: absolute;
  inset: 0;
  border: none;
  background-color: transparent;
  border-radius: var(--pico-border-radius);
  margin: 0;
  width: 100%;
  height: 100%;
  background-image: none !important;
}

.field:first-child {
  z-index: 10;
}

.field:first-child:checked {
  z-index: 0;
}

.field:checked + .field {
  z-index: 10;
}
</style>