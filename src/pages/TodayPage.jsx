import React, { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Flame } from 'lucide-react'
import { format } from 'date-fns'
import { useHabitStore, isTodayDone } from '@/store/useHabitStore'
import HabitCard from '@/components/HabitCard'
import StatsRow from '@/components/StatsRow'

const HabitModal = lazy(() => import('@/components/HabitModal'))

const CATEGORIES = ['all', 'health', 'mind', 'work', 'body', 'social']
const GREETING_MAP = { 0: 'Good morning', 12: 'Good afternoon', 17: 'Good evening' }
function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function TodayPage() {
  const habits = useHabitStore(s => s.habits)
  const getBestStreak = useHabitStore(s => s.getBestStreak)
  const [modalOpen, setModalOpen] = useState(false)
  const [editHabit, setEditHabit] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? habits : habits.filter(h => h.category === filter)
  const pending = filtered.filter(h => !isTodayDone(h))
  const completed = filtered.filter(h => isTodayDone(h))
  const done = habits.filter(isTodayDone).length
  const total = habits.length
  const streak = getBestStreak()
  const dateStr = format(new Date(), 'EEEE, MMMM d')

  const openEdit = (habit) => { setEditHabit(habit); setModalOpen(true) }
  const openAdd = () => { setEditHabit(null); setModalOpen(true) }

  return (
    <>
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: '20px 20px 8px' }}
      >
        <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
          {dateStr}
        </div>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, lineHeight: 1.2 }}>
          {greeting()},{' '}
          <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{done}/{total}</em> done
        </div>
      </motion.div>

      {/* Stats */}
      <StatsRow done={done} total={total} bestStreak={streak} />

      {/* Streak badge */}
      <AnimatePresence>
        {streak >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', borderRadius: 20, margin: '0 20px 12px',
              background: 'rgba(245,200,122,0.12)',
              border: '1px solid rgba(245,200,122,0.3)',
              fontSize: 13, color: 'var(--amber)', fontWeight: 600,
            }}
          >
            <Flame size={14} /> {streak}-day streak — you're on fire!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminder badge */}
      {habits.some(h => h.reminder && !isTodayDone(h)) && (() => {
        const next = habits.find(h => h.reminder && !isTodayDone(h))
        return next ? (
          <div style={{
            background: 'var(--surface2)', borderRadius: 12,
            padding: '12px 16px', margin: '0 20px 12px',
            display: 'flex', alignItems: 'center', gap: 10,
            border: '1px solid var(--border)',
            fontSize: 13, color: 'var(--text2)',
          }}>
            <span style={{ fontSize: 18 }}>🔔</span>
            <span>Reminder: <strong style={{ color: 'var(--text)' }}>{next.name}</strong> at {next.reminder}</span>
          </div>
        ) : null
      })()}

      {/* Category filter */}
      <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(cat)}
            style={{
              padding: '5px 14px', borderRadius: 20, cursor: 'pointer', whiteSpace: 'nowrap',
              border: `1px solid ${filter === cat ? 'var(--accent)' : 'var(--border)'}`,
              background: filter === cat ? 'rgba(168,230,207,0.12)' : 'transparent',
              color: filter === cat ? 'var(--accent)' : 'var(--text3)',
              fontSize: 12, fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Habits section */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Habits
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={openAdd}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', fontSize: 12, borderRadius: 20 }}
          >
            <Plus size={14} /> Add
          </motion.button>
        </div>

        {/* Empty state */}
        {habits.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '40px 20px' }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, marginBottom: 8 }}>Start your journey</div>
            <div style={{ fontSize: 14, color: 'var(--text3)', lineHeight: 1.5 }}>Add your first habit to begin building consistency.</div>
          </motion.div>
        )}

        {/* Pending habits */}
        <AnimatePresence>
          {pending.map(habit => (
            <HabitCard key={habit.id} habit={habit} onEdit={openEdit} />
          ))}
        </AnimatePresence>

        {/* Completed habits */}
        {completed.length > 0 && (
          <>
            <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', margin: '16px 0 8px' }}>
              Completed · {completed.length}
            </div>
            <AnimatePresence>
              {completed.map(habit => (
                <HabitCard key={habit.id} habit={habit} onEdit={openEdit} />
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Modal */}
      <Suspense fallback={null}>
        <HabitModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          editHabit={editHabit}
        />
      </Suspense>
    </>
  )
}
