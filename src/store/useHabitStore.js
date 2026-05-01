import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format, subDays, parseISO, isToday as dateFnsIsToday } from 'date-fns'

const TODAY = format(new Date(), 'yyyy-MM-dd')

// ─── SEED DATA ────────────────────────────────────────────────────────
function buildCompletions(offsetsBack) {
  const r = {}
  offsetsBack.forEach(d => {
    const dt = subDays(new Date(), d)
    r[format(dt, 'yyyy-MM-dd')] = true
  })
  return r
}

const SEED_HABITS = [
  {
    id: 1, name: 'Morning meditation', category: 'mind', emoji: '🧘',
    reminder: '07:00', color: 'lavender',
    completions: buildCompletions([1, 2, 3, 4, 5, 6]),
    streak: 6, bestStreak: 6, createdAt: Date.now(),
  },
  {
    id: 2, name: 'Drink 2L water', category: 'health', emoji: '💧',
    reminder: '', color: 'accent',
    completions: buildCompletions([0, 1, 3, 5, 6]),
    streak: 1, bestStreak: 5, createdAt: Date.now(),
  },
  {
    id: 3, name: 'Read 30 minutes', category: 'mind', emoji: '📚',
    reminder: '21:00', color: 'lavender',
    completions: buildCompletions([1, 2, 4, 6]),
    streak: 0, bestStreak: 4, createdAt: Date.now(),
  },
  {
    id: 4, name: 'Evening run', category: 'body', emoji: '🏃',
    reminder: '18:00', color: 'amber',
    completions: buildCompletions([2, 3, 4]),
    streak: 0, bestStreak: 3, createdAt: Date.now(),
  },
]

// ─── HELPERS ──────────────────────────────────────────────────────────
export function getCurrentStreak(habit) {
  let s = 0
  let dt = new Date()
  while (true) {
    const key = format(dt, 'yyyy-MM-dd')
    if (!habit.completions[key]) break
    s++
    dt = subDays(dt, 1)
  }
  return s
}

export function getMonthCompletion(habit, days = 30) {
  let done = 0
  for (let i = 0; i < days; i++) {
    const key = format(subDays(new Date(), i), 'yyyy-MM-dd')
    if (habit.completions[key]) done++
  }
  return Math.round((done / days) * 100)
}

export function getWeekData(habit) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i)
    return {
      day: format(d, 'EEE'),
      date: format(d, 'yyyy-MM-dd'),
      done: !!habit.completions[format(d, 'yyyy-MM-dd')],
      isToday: i === 6,
    }
  })
}

export function isTodayDone(habit) {
  return !!habit.completions[TODAY]
}

// ─── STORE ────────────────────────────────────────────────────────────
export const useHabitStore = create(
  persist(
    (set, get) => ({
      habits: SEED_HABITS,
      theme: 'dark',
      activeTab: 'today',
      filterCategory: 'all',

      // ── Theme ──
      toggleTheme: () =>
        set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // ── Tab ──
      setTab: (tab) => set({ activeTab: tab }),

      // ── Filter ──
      setFilter: (cat) => set({ filterCategory: cat }),

      // ── Toggle completion ──
      toggleCompletion: (id) =>
        set(s => {
          const habits = s.habits.map(h => {
            if (h.id !== id) return h
            const done = !!h.completions[TODAY]
            const completions = { ...h.completions }
            if (done) {
              delete completions[TODAY]
            } else {
              completions[TODAY] = true
            }
            const streak = done ? Math.max(0, h.streak - 1) : getCurrentStreak({ ...h, completions })
            const bestStreak = Math.max(h.bestStreak || 0, streak)
            return { ...h, completions, streak, bestStreak }
          })
          return { habits }
        }),

      // ── Add habit ──
      addHabit: (data) =>
        set(s => ({
          habits: [
            ...s.habits,
            {
              id: Date.now(),
              completions: {},
              streak: 0,
              bestStreak: 0,
              createdAt: Date.now(),
              ...data,
            },
          ],
        })),

      // ── Edit habit ──
      updateHabit: (id, data) =>
        set(s => ({
          habits: s.habits.map(h => (h.id === id ? { ...h, ...data } : h)),
        })),

      // ── Delete habit ──
      deleteHabit: (id) =>
        set(s => ({ habits: s.habits.filter(h => h.id !== id) })),

      // ── Selectors ──
      getTodayHabits: () => {
        const { habits, filterCategory } = get()
        const filtered = filterCategory === 'all' ? habits : habits.filter(h => h.category === filterCategory)
        return {
          pending: filtered.filter(h => !isTodayDone(h)),
          completed: filtered.filter(h => isTodayDone(h)),
          total: filtered.length,
          done: filtered.filter(h => isTodayDone(h)).length,
        }
      },

      getBestStreak: () => Math.max(0, ...get().habits.map(h => h.streak || 0)),

      getTotalCompletionsToday: () => get().habits.filter(h => isTodayDone(h)).length,
    }),
    {
      name: 'habitflow-storage',
      partialize: (s) => ({ habits: s.habits, theme: s.theme }),
    }
  )
)
