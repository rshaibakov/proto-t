export type TActivityLogItemStatus = 'idle' | 'done' | 'failed'

export type TActivityLogItem = {
  id: string
  date: string
  status: TActivityLogItemStatus
  activity_id: string
  user_id: string
}
