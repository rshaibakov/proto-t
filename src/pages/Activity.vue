<script setup lang="ts">
import { ActivityCalendar } from '../components/ActivityCalendar'
import { provide, ref, watchEffect } from 'vue'
import { fetchActivityLog } from '../api/activity/fetch-activity-log'
import type { TCheckedDates } from '../components/ActivityCalendar/types'

const startDate = new Date('2025-04-23')
const activityId = '9f3539e3-3126-4be3-aac1-5636a4939577'
provide('activityId', activityId)

const checkedDates = ref<TCheckedDates>(new Map())

watchEffect(async () => {
  const data = await fetchActivityLog(activityId)

  if (data) {
    checkedDates.value = new Map(data.map(item => [item.date, item]))
  }
})
</script>

<template>
  <h1 class="title">Не курить</h1>

  <ActivityCalendar
    :startDate="startDate"
    :checkedDates="checkedDates"
  />
</template>

<style scoped>
.title {
  color: var(--pico-h1-color);
  margin-block: var(--space-xl);
}
</style>
