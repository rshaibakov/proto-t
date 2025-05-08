import { api } from '../client'
import type { TActivityLogItem } from './types'

export async function fetchActivityLog(activityId: string) {
  const { data, error } = await api.from('activities_log')
    .select('*')
    .eq('activity_id', activityId)

  if (error) {
    console.error(error)
  }

  return data
}