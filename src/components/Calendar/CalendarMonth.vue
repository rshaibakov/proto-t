
<template>
  <article class="month">
    <CalendarBalloon
      v-if="isFirst"
      type="start"
      class="balloon"
    />

    <CalendarBalloon v-else class="balloon" />

    <CalendarBalloon
      v-if="isLast"
      type="finish"
      class="balloon"
    />

    <div v-if="!isLast" class="timeline" aria-hidden="true" />

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
        :today="day.isCurrent"
        :disabled="day.isBeforeStart || day.isAfterFinish"
        :status="checkedDates?.get(dayKey)?.status"
        @update:status="(status) => onDayStatusChange(dayKey, status)"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import CalendarDay from './CalendarDay.vue'
import CalendarBalloon from './CalendarBalloon.vue'
import { activityId, daysOfWeek } from './const'
import type { TCheckedDates, TDayStatus, TDayUpsertPayload, TMonth } from './types'
import { db } from '../../db'

type TMonthProps = {
  month: TMonth
  checkedDates: TCheckedDates
  isFirst: boolean
  isLast: boolean
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
  container: month / inline-size;
  position: relative;
  grid-template-areas:
    'balloon header'
    'timeline days-of-week'
    'timeline days';
  grid-template-columns: minmax(1.5rem, 3rem) 1fr;
  padding: 0;
  margin: 0;
  display: grid;
  row-gap: 1cqh;
  background: transparent;
  box-shadow: none;
}

.balloon {
  container: balloon / size;
  grid-area: balloon;
  align-self: center;
  justify-self: center;
}

.timeline {
  position: relative;
  inset-block-start: -1.5rem;
  grid-area: timeline;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: calc(100% + 3rem);
}

.timeline::after {
  content: '';
  width: 1px;
  height: 100%;
  border-left: .25rem dotted light-dark(var(--pico-color-slate-150), var(--pico-color-slate-800));
}

.header {
  grid-area: header;
  padding-inline: 5cqw var(--space-lg);
  background-color: transparent;
  border: none;
  margin: 0;
}

.title {
  font-size: clamp(1rem, 3cqw, 1.25rem);
  text-transform: uppercase;
  color: light-dark(var(--pico-color-slate-700), var(--pico-color-slate-200));
  margin: 0;
}

.days {
  grid-area: days;
  padding-block: 0 var(--space-lg);
  padding-inline: var(--space-lg);
  display: grid;
  grid-template-columns: repeat(7, minmax(auto, 1fr));
  gap: clamp(0.5rem, 2cqw, 1rem);
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
  grid-area: days-of-week;
  padding-inline: var(--space-lg);
  height: clamp(1.5rem, 5cqh, 3rem);
  display: grid;
  grid-template-columns: repeat(7, minmax(auto, 1fr));
  gap: var(--space-lg);
  background-color: light-dark(var(--pico-color-slate-100), var(--pico-color-slate-800));
  border-radius: calc(infinity * 1px);
}

.day-of-week {
  container-type: inline-size;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-of-week strong {
  font-size: clamp(.75rem, 40cqw, 1rem);
  text-wrap: nowrap;
}
</style>