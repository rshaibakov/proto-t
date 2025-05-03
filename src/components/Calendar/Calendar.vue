
<template>
  <section class="calendar">
    <CalendarMonth
      v-for="[monthKey, month] in months"
      :key="monthKey"
      :month="month"
      :checked-dates="checkedDates"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { activityId, startDate } from './const'
import type { TCheckedDates } from './types'
import CalendarMonth from './CalendarMonth.vue'
import { getDaysByMonths } from './utils'
import { db } from '../../db'

const checkedDates = ref<TCheckedDates>(new Map())

watchEffect(async () => {
  const { data, error } = await db
    .from('activities_log')
    .select('*')
    .eq('activity_id', activityId)

  if (data) {
    checkedDates.value = new Map(data.map(item => [item.date, item]))
  }

  if (error) {
    console.error(error)
  }
})

const months = getDaysByMonths(startDate)
</script>

<style scoped>
.calendar {
  --month-columns: auto-fit;

  display: grid;
  grid-template-columns: minmax(320px, 640px);
  gap: var(--space-xl);
}
</style>