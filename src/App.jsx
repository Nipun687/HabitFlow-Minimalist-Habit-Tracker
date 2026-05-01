import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useHabitStore } from '@/store/useHabitStore'
import Layout from '@/components/Layout'
import TodayPage from '@/pages/TodayPage'
import ProgressPage from '@/pages/ProgressPage'
import AllHabitsPage from '@/pages/AllHabitsPage'

export default function App() {
  const theme = useHabitStore(s => s.theme)

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/today" replace />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/all" element={<AllHabitsPage />} />
        <Route path="*" element={<Navigate to="/today" replace />} />
      </Routes>
    </Layout>
  )
}
