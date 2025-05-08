<script setup lang="ts">
import { inject } from 'vue'
import ActivityCalendarMonth from './ActivityCalendarMonth.vue'
import type { TCheckedDays } from './types'
import { getDaysByMonths } from './utils'

type TActivityCalendarProps = {
  startDate: Date
  checkedDays: TCheckedDays
}

const props = defineProps<TActivityCalendarProps>()

const daysToComplete = inject<number>('daysToComplete')
const months = getDaysByMonths(props.startDate, daysToComplete ?? 0)
</script>

<template>
  <section class="calendar">
    <ActivityCalendarMonth
      v-for="([monthKey, month], index) in months"
      :key="monthKey"
      :month="month"
      :isFirst="index === 0"
      :isLast="index === months.size - 1"
      :checkedDays="checkedDays"
    />
  </section>
</template>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>