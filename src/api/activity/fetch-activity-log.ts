import { api } from '../client'

export async function fetchActivityLog(activityId: string) {
  const { data, error } = await api.from('activities_log')
    .select('*')
    .eq('activity_id', activityId)

  if (error) {
    console.error(error)
  }

  return data
}