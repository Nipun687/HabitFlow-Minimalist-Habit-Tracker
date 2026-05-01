import React, { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useHabitStore, getMonthCompletion, getCurrentStreak } from '@/store/useHabitStore'

const HabitModal = lazy(() => import('@/components/HabitModal'))

export default function AllHabitsPage() {
  const habits = useHabitStore(s => s.habits)
  const deleteHabit = useHabitStore(s => s.deleteHabit)
  const [modalOpen, setModalOpen] = useState(false)
  const [editHabit, setEditHabit] = useState(null)
  const [sortBy, setSortBy] = useState('created')

  const sorted = [...habits].sort((a, b) => {
    if (sortBy === 'streak') return (b.streak || 0) - (a.streak || 0)
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'pct') return getMonthCompletion(b) - getMonthCompletion(a)
    return b.createdAt - a.createdAt
  })

  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26 }}>All Habits</div>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{habits.length} habit{habits.length !== 1 ? 's' : ''} total</div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setEditHabit(null); setModalOpen(true) }}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', fontSize: 13, borderRadius: 20 }}
        >
          <Plus size={15} /> Add Habit
        </motion.button>
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[['created', 'Recent'], ['streak', 'Streak'], ['pct', 'Completion'], ['name', 'A-Z']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setSortBy(val)}
            style={{
              padding: '5px 12px', borderRadius: 20, cursor: 'pointer', whiteSpace: 'nowrap',
              border: `1px solid ${sortBy === val ? 'var(--accent)' : 'var(--border)'}`,
              background: sortBy === val ? 'rgba(168,230,207,0.12)' : 'transparent',
              color: sortBy === val ? 'var(--accent)' : 'var(--text3)',
              fontSize: 12, fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {habits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '60px 0' }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, marginBottom: 8 }}>No habits yet</div>
          <div style={{ fontSize: 14, color: 'var(--text3)' }}>Create your first habit to get started.</div>
        </motion.div>
      ) : (
        <AnimatePresence>
          {sorted.map((habit, i) => {
            const pct = getMonthCompletion(habit)
            const streak = habit.streak || 0
            return (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.03 }}
                className="card"
                style={{ padding: '16px', marginBottom: 10 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>
                      {habit.emoji} {habit.name}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className={`tag tag-${habit.category}`}>{habit.category}</span>
                      {streak > 0 && (
                        <span style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 500 }}>🔥 {streak}d streak</span>
                      )}
                      {habit.bestStreak > 0 && (
                        <span style={{ fontSize: 11, color: 'var(--text3)' }}>Best: {habit.bestStreak}d</span>
                      )}
                      {habit.reminder && (
                        <span style={{ fontSize: 11, color: 'var(--text3)' }}>🔔 {habit.reminder}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { setEditHabit(habit); setModalOpen(true) }}
                      className="btn-icon"
                      style={{ width: 30, height: 30, fontSize: 13 }}
                      aria-label="Edit habit"
                    >
                      ✎
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteHabit(habit.id)}
                      className="btn-icon"
                      style={{ width: 30, height: 30, fontSize: 13, color: 'var(--rose)' }}
                      aria-label="Delete habit"
                    >
                      ✕
                    </motion.button>
                  </div>
                </div>

                {/* 30-day bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="progress-bg" style={{ flex: 1, height: 5 }}>
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.03 }}
                      style={{ height: '100%' }}
                    />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, minWidth: 32, textAlign: 'right' }}>
                    {pct}%
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>30-day completion</div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}

      <Suspense fallback={null}>
        <HabitModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          editHabit={editHabit}
        />
      </Suspense>
    </div>
  )
}
