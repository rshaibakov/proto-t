
<template>
  <section class="calendar">
    <article
      v-for="(month, monthKey) in months"
      :key="monthKey"
      class="month"
    >
      <header class="header">
        <h2 class="title">
          {{ month.title }}
        </h2>
      </header>

      <div class="days-of-week">
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="day-of-week"
        >
          <strong>
            {{ day }}
          </strong>
        </div>
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
          :sub-label="day.isCurrent ? 'Сегодня' : undefined"
          :out-of-month="!day.outOfMonth"
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
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)

    result.push({
      title: date.toLocaleString('ru-RU', {
        month: 'long',
        year: 'numeric'
      }).replace(' г.', ''),
      weeks: getMonthWeeks(date, checkedDates.value)
    })
  }

  return result
})

</script>

<style scoped>
.calendar {
  --month-columns: auto-fit;

  display: grid;
  grid-template-columns: repeat(var(--month-columns), minmax(320px, 1fr));
  gap: var(--space-xl);
}

@media (width > 1600px) {
  .calendar {
    --month-columns: 4;
  }
}

.month {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.header {
  padding-inline: var(--space-lg);
  background-color: transparent;
  border: none;
  margin: 0;
}

.title {
  color: var(--pico-h2-color);
  margin: 0;
}

.week {
  padding-inline: var(--space-lg);
  display: grid;
  grid-template-columns: repeat(7, minmax(auto, 1fr));
  gap: var(--space-lg);
}

.week:last-child {
  padding-block-end: var(--space-lg);
}

.days-of-week {
  padding-inline: var(--space-lg);
  display: grid;
  grid-template-columns: repeat(7, minmax(auto, 1fr));
  gap: var(--space-lg);
  background-color: light-dark(var(--pico-color-slate-100), var(--pico-color-slate-800));
}

.day-of-week {
  container-type: inline-size;
  padding-block: var(--space-md);
  padding-inline: var(--space-sm);
  text-align: center;
}

.day-of-week strong {
  font-size: clamp(1rem, 2cqw, 2rem);
  text-wrap: nowrap;
}
</style>