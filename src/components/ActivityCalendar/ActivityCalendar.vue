<script setup lang="ts">
import ActivityCalendarMonth from './ActivityCalendarMonth.vue'
import type { TCheckedDates } from './types'
import { getDaysByMonths } from './utils'

type TActivityCalendarProps = {
  startDate: Date
  checkedDates: TCheckedDates
}

const props = defineProps<TActivityCalendarProps>()

const months = getDaysByMonths(props.startDate)
</script>

<template>
  <section class="calendar">
    <ActivityCalendarMonth
      v-for="([monthKey, month], index) in months"
      :key="monthKey"
      :month="month"
      :is-first="index === 0"
      :is-last="index === months.size - 1"
      :checked-dates="checkedDates"
    />
  </section>
</template>

<style scoped>
.calendar {
  --month-columns: auto-fit;

  display: grid;
  grid-template-columns: minmax(320px, 580px);
  gap: 1rem;
}
</style>