import type { TActivityLogItem } from "../../api/activity/types"

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

export type TCheckedDays = Map<string, TActivityLogItem>