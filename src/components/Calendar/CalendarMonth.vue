
<template>
  <article class="month">
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
        :disabled="day.isBeforeStart || day.isAfterFinish"
        :status="checkedDates?.get(dayKey)?.status"
        @update:status="(status) => onDayStatusChange(dayKey, status)"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { db } from '../../db'
import CalendarDay from './CalendarDay.vue'
import { activityId, daysOfWeek } from './const'
import type { TCheckedDates, TDayStatus, TDayUpsertPayload, TMonth } from './types'

type TMonthProps = {
  month: TMonth
  checkedDates: TCheckedDates
}

const props = defineProps<TMonthProps>()

const onDayStatusChange = async (date: string, status: TDayStatus) => {
  const payload: TDayUpsertPayload = {
    date,
    status,
    activity_id: activityId,
  }

  if (props.checkedDates.get(date)?.id) {
    payload.id = props.checkedDates.get(date)?.id
  }

  const { data, error } = await db
    .from('activities_log')
    .upsert(payload)
    .select()

  if (data) {
    props.checkedDates.set(data[0].date, data[0])
  }

  if (error) {
    console.error(error)
  }
}
</script>

<style scoped>
.month {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  background: transparent;
  box-shadow: none;
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
  gap: var(--space-xl);
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
  background-color: light-dark(var(--pico-color-slate-150), var(--pico-color-slate-800));
  border-radius: calc(infinity * 1px);
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