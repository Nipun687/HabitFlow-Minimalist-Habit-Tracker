import { format, subDays, differenceInDays } from 'date-fns'

export const TODAY = format(new Date(), 'yyyy-MM-dd')

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date) {
  return format(date, 'yyyy-MM-dd')
}

export function getLast30Days() {
  return Array.from({ length: 30 }, (_, i) => format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'))
}

export function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

export function getCompletionPercent(completions, days = 30) {
  let done = 0
  for (let i = 0; i < days; i++) {
    const key = format(subDays(new Date(), i), 'yyyy-MM-dd')
    if (completions[key]) done++
  }
  return Math.round((done / days) * 100)
}

export function getStreakFromCompletions(completions) {
  let streak = 0
  let dt = new Date()
  while (true) {
    const key = format(dt, 'yyyy-MM-dd')
    if (!completions[key]) break
    streak++
    dt = subDays(dt, 1)
  }
  return streak
}

export const CATEGORY_COLORS = {
  health: 'var(--accent)',
  mind: 'var(--lavender)',
  work: 'var(--sky)',
  body: 'var(--amber)',
  social: 'var(--rose)',
}

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}
