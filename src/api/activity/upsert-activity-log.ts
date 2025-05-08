import { api } from '../client'
import type { TActivityLogItemStatus } from './types'

export type TActivityLogItemUpsertPayload = {
  id?: string
  date: string
  status: TActivityLogItemStatus
  activity_id: string
  user_id?: string
}

export async function upsertActivityLog(payload: TActivityLogItemUpsertPayload) {
  const { data, error } = await api
    .from('activities_log')
    .upsert(payload)
    .select()

  if (error) {
    console.error(error)
  }

  return data
}