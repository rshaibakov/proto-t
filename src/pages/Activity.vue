<script setup lang="ts">
import { ActivityCalendar } from '../components/ActivityCalendar'
import { ActivityProgress } from '../components/ActivityProgress'
import { provide, ref, watchEffect } from 'vue'
import { fetchActivityLog } from '../api/activity/fetch-activity-log'
import type { TCheckedDays } from '../components/ActivityCalendar/types'

const startDate = new Date('2025-04-23')
const daysToComplete = 365
provide('daysToComplete', daysToComplete)
const activityId = '9f3539e3-3126-4be3-aac1-5636a4939577'
provide('activityId', activityId)

const checkedDays = ref<TCheckedDays>(new Map())
const countSuccessfulDays = ref(0)

watchEffect(async () => {
  const response = await fetchActivityLog(activityId)

  if (response) {
    for (const item of response) {
      checkedDays.value.set(item.date, item)

      if (item.status === 'done') {
        countSuccessfulDays.value += 1
      }
    }
  }
})
</script>

<template>
  <section class="region">
    <h1 class="title">Не курить</h1>

    <ActivityProgress
      :max="daysToComplete"
      :value="countSuccessfulDays"
      class="progress"
    />

    <ActivityCalendar
      :startDate="startDate"
      :checkedDays="checkedDays"
      class="calendar"
    />
  </section>
</template>

<style scoped>
.title {
  color: var(--pico-h1-color);
  margin-block: var(--space-xl);
}

.region {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: clamp(320px, 100%, 580px);
}
</style>
