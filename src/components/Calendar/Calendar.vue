
<template>
  <section class="calendar">
    <article
      v-for="(month, monthKey) in months"
      :key="monthKey"
      class="month"
    >
      <h2 class="title">
        {{ month.title }}
      </h2>

      <div class="week" data-is-header>
        <strong
          v-for="day in daysOfWeek"
          :key="day"
          class="day-of-week"
        >
          {{ day }}
        </strong>
      </div>

      <div
        v-for="(week, weekKey) in month.weeks"
        :key="weekKey"
        class="week"
      >
        <CalendarDay
          v-for="[dayKey, day] in week"
          :key="dayKey"
          :label="day.value"
          :out-of-month="!day.isCurrent"
          :status="checkedDates?.get(dayKey)?.status"
          @update:status="(status) => onDayStatusChange(dayKey, status)"
        />
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { activityId, daysOfWeek, startDate, totalMonths } from './const'
import CalendarDay from './CalendarDay.vue'
import type { TDayResponse, TDayStatus, TDayUpsertPayload, TMonth } from './types'
import { getMonthWeeks } from './utils'
import { db } from '../../db'

const checkedDates = ref<Map<string, TDayResponse>>(new Map())

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

const onDayStatusChange = async (date: string, status: TDayStatus) => {
  const payload: TDayUpsertPayload = {
    date,
    status,
    activity_id: activityId,
  }

  if (checkedDates.value.get(date)?.id) {
    payload.id = checkedDates.value.get(date)?.id
  }

  const { data, error } = await db
    .from('activities_log')
    .upsert(payload)
    .select()

  if (data) {
    checkedDates.value.set(data[0].date, data[0])
  }

  if (error) {
    console.error(error)
  }
}

const months = computed<TMonth[]>(() => {
  const result = []

  for (let i = 0; i < totalMonths; i++) {
    const currentDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)

    result.push({
      title: currentDate.toLocaleString('ru-RU', {
        month: 'long',
        year: 'numeric'
      }).replace(' г.', ''),
      weeks: getMonthWeeks(currentDate, checkedDates.value)
    })
  }

  return result
})

</script>

<style scoped>
.calendar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-xl);
}

@media (width > 576px) {
  .calendar {
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  }
}

@media (width > 1280px) {
  .calendar {
    grid-template-columns: repeat(3, minmax(360px, 1fr));
  }
}

.month {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.title {
  color: var(--pico-h2-color);
}

.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-lg);
}

.week:where([data-is-header]) {
  border-radius: var(--pico-border-radius);
  background-color: light-dark(var(--pico-color-slate-100), var(--pico-color-slate-800));
}

.day-of-week {
  padding-block: var(--space-md);
  padding-inline: var(--space-sm);
  text-align: center;
}
</style>