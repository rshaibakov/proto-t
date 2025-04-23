export type TDayStatus = 'idle' | 'done' | 'failed'

export type TDay = {
  value: number
  status: TDayStatus
  isCurrent: boolean
}

export type TMonth = {
  title: string
  weeks: Map<string, TDay>[]
}

export type TDayResponse = {
  id: string
  date: string
  status: TDayStatus
  activity_id: string
  user_id: string
}

export type TDayUpsertPayload = {
  id?: string
  date: string
  status: TDayStatus
  activity_id: string
  user_id?: string
}