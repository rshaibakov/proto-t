export type TDayStatus = 'idle' | 'done' | 'failed'

export type TDay = {
  value: number
  dayOfWeek: number,
  isCurrent: boolean
  isBeforeStart: boolean
  isAfterFinish: boolean
}

export type TMonth = {
  title: string
  days: Map<string, TDay>
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

export type TCheckedDates = Map<string, TDayResponse>