
<template>
  <label
    class="day"
    :data-disabled="disabled"
    :data-today="today"
  >
    <template v-if="!disabled">
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

    <ArrowtIcon v-if="today" class="icon" />
  </label>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import ArrowtIcon from '../../assets/icons/arrow_drop_up.svg?component'
import { dayStatuses } from './const';
import type { TDayStatus } from './types';

type TDayProps = {
  label: string | number
  today?: boolean
  disabled?: boolean
}

defineProps<TDayProps>()

const fieldName = useId()
const status = defineModel<TDayStatus>('status', { default: 'idle' })
</script>

<style scoped>
.day {
  container: day / size;
  box-sizing: border-box;
  margin: 0;
  position: relative;
  width: auto;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(infinity * 1px);
}

@media(hover: hover) {
  .day:not([data-disabled="true"]):hover,
  .day:not([data-disabled="true"]):focus-within {
    cursor: pointer;
    outline: .75cqw solid light-dark(var(--pico-color-slate-150), var(--pico-color-slate-800));
    outline-offset: 0;
    color: var(--pico-contrast);
  }
}

.day:is([data-disabled="true"]) {
  color: light-dark(var(--pico-color-slate-400), var(--pico-color-slate-700));
}

.day:is([data-today="true"]) {
  border: .5cqw solid light-dark(var(--pico-color-slate-700), var(--pico-color-slate-150));
}

.day:has(.field:is([value="done"]):checked) {
  background-color: var(--pico-color-green-450);
  color: var(--pico-color-green-50);
}

@media(hover: hover) {
  .day:has(.field:is([value="done"]):checked):hover,
  .day:has(.field:is([value="done"]):checked):focus-within {
    background-color: var(--pico-color-green-500);
    color: var(--pico-color-green-50);
  }
}

.day:has(.field:is([value="failed"]):checked) {
  background-color: var(--pico-color-pink-500);
  color: var(--pico-color-pink-50);
}

@media(hover: hover) {
  .day:has(.field:is([value="failed"]):checked):hover,
  .day:has(.field:is([value="failed"]):checked):focus-within {
    background-color: var(--pico-color-pink-450);
    color: var(--pico-color-pink-50);
  }
}

.label {
  position: relative;
  z-index: 1;
  font-size: clamp(.75rem, 35cqw, 1rem);
}

.field {
  position: absolute;
  inset: 0;
  border: none;
  display: inline-block;
  background-color: transparent;
  border-radius: inherit;
  margin: 0;
  width: 100%;
  height: 100%;
  background-image: none !important;
}

.field:focus {
  outline: none;
  box-shadow: none;
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

.icon {
  position: absolute;
  width: 50cqw;
  inset: auto auto -45cqh;
}
</style>