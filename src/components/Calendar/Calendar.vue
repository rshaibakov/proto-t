
<template>
  <section class="calendar">
    <article
      v-for="[monthKey, month] in months"
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

      <div class="days">
        <CalendarDay
          v-for="[dayKey, day] in month.days"
          class="day"
          :data-day-of-week="day.dayOfWeek"
          :key="dayKey"
          :label="day.value"
          :sub-label="day.isCurrent ? 'Сегодня' : undefined"
          :disabled="day.isBeforeStart || day.isAfterFinish"
          :status="checkedDates?.get(dayKey)?.status"
          @update:status="(status) => onDayStatusChange(dayKey, status)"
        />
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { activityId, daysOfWeek, startDate } from './const'
import CalendarDay from './CalendarDay.vue'
import type { TDayResponse, TDayStatus, TDayUpsertPayload } from './types'
import { getDaysByMonths } from './utils'
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

const months = getDaysByMonths(startDate)

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

.days {
  padding-block: 0 var(--space-lg);
  padding-inline: var(--space-lg);
  display: grid;
  grid-template-columns: repeat(7, minmax(auto, 1fr));
  gap: var(--space-lg);
}

.day:first-child:is([data-day-of-week="1"]) {
  grid-column-start: 1;
}

.day:first-child:is([data-day-of-week="2"]) {
  grid-column-start: 2;
}

.day:first-child:is([data-day-of-week="3"]) {
  grid-column-start: 3;
}

.day:first-child:is([data-day-of-week="4"]) {
  grid-column-start: 4;
}

.day:first-child:is([data-day-of-week="5"]) {
  grid-column-start: 5;
}

.day:first-child:is([data-day-of-week="6"]) {
  grid-column-start: 6;
}

.day:first-child:is([data-day-of-week="0"]) {
  grid-column-start: 7;
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