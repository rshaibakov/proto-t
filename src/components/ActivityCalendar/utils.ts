import { totalMonths } from "./const"
import type { TMonth } from "./types"

export function getDaysByMonths(startDate: Date) {
  const months = new Map<string, TMonth>()
  const finishDate = new Date(startDate)
  finishDate.setMonth(startDate.getMonth() + totalMonths)

  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  const lastDate = new Date(finishDate.getFullYear(), finishDate.getMonth() + 1, 0)
  const cursorDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)

  while (cursorDate <= lastDate) {
    const monthKey = getMonthKey(cursorDate)

    if (!months.has(monthKey)) {
      months.set(monthKey, {
        title: cursorDate.toLocaleString('ru-RU', {
          month: 'long',
          year: 'numeric',
        }).replace(' г.', ''),
        days: new Map(),
      })
    }

    months.get(monthKey)?.days.set(getDayKey(cursorDate), {
      value: cursorDate.getDate(),
      dayOfWeek: cursorDate.getDay(),
      isCurrent: cursorDate.getTime() === currentDate.getTime(),
      isBeforeStart: cursorDate.getTime() <= startDate.getTime(),
      isAfterFinish: cursorDate.getTime() > finishDate.getTime(),
    })

    cursorDate.setDate(cursorDate.getDate() + 1)
  }

  return months
}

function getMonthKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01`
}

function getDayKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
