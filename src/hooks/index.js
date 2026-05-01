// useLocalStorage.js
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn('[HabitFlow] localStorage write failed, using in-memory state.')
    }
  }

  return [storedValue, setValue]
}

// useSmartReminder.js — mocked notification system
export function useSmartReminder(habits) {
  useEffect(() => {
    if (!('Notification' in window)) return

    const check = () => {
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
      habits.forEach(habit => {
        if (habit.reminder === timeStr) {
          const done = !!habit.completions[new Date().toISOString().split('T')[0]]
          if (!done && Notification.permission === 'granted') {
            new Notification('HabitFlow Reminder', {
              body: `Time for: ${habit.emoji} ${habit.name}`,
              icon: '/favicon.svg',
            })
          }
        }
      })
    }

    const id = setInterval(check, 60000)
    return () => clearInterval(id)
  }, [habits])
}

// useKeyboardShortcuts.js
import { useEffect } from 'react'

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handler = (e) => {
      const key = [
        e.ctrlKey && 'ctrl',
        e.metaKey && 'meta',
        e.shiftKey && 'shift',
        e.key.toLowerCase(),
      ].filter(Boolean).join('+')
      if (shortcuts[key]) shortcuts[key](e)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts])
}
