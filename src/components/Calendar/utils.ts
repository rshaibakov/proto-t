import type { TDay, TDayResponse, TWeek } from "./types"

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

  const current = new Date(startDate)

  while (current <= endDate) {
    const currentKey = getKeyByDate(current)
    const day = {
      value: current.getDate(),
      status: checkedDates.get(currentKey)?.status ?? 'idle',
      isCurrent: current.getMonth() === month
    }

    week.set(currentKey, day)

    if (week.size === 7) {
      weeks.push(week)
      week = new Map()
    }

    current.setDate(current.getDate() + 1)
  }

  return weeks
}

function getKeyByDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}