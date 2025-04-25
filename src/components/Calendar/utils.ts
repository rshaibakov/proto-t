import type { TDay, TDayResponse } from "./types"

const currentDateKey = getKeyByDate(new Date())

export function getMonthWeeks(date: Date, checkedDates: Map<string, TDayResponse>): Map<string, TDay>[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const weeks = []
  let week = new Map()

  // Первый день месяца
  const firstDay = new Date(year, month, 1)

  // Последний день месяца
  const lastDay = new Date(year, month + 1, 0)

  // Начало первой недели (понедельник)
  const startDate = new Date(firstDay)
  startDate.setDate(firstDay.getDate() - (firstDay.getDay() + 6) % 7)

  // Конец последней недели (воскресенье)
  const endDate = new Date(lastDay)
  endDate.setDate(lastDay.getDate() + (7 - lastDay.getDay()) % 7)

  const cursorDate = new Date(startDate)

  while (cursorDate <= endDate) {
    const cursorDateKey = getKeyByDate(cursorDate)

    const day = {
      value: cursorDate.getDate(),
      status: checkedDates.get(cursorDateKey)?.status ?? 'idle',
      isCurrent: cursorDateKey === currentDateKey,
      outOfMonth: cursorDate.getMonth() === month,
    }

    week.set(cursorDateKey, day)

    if (week.size === 7) {
      weeks.push(week)
      week = new Map()
    }

    cursorDate.setDate(cursorDate.getDate() + 1)
  }

  return weeks
}

function getKeyByDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}