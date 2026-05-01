import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, Flame } from 'lucide-react'
import { useHabitStore, isTodayDone, getCurrentStreak } from '@/store/useHabitStore'
import toast from 'react-hot-toast'

function burstConfetti(x, y) {
  const colors = ['#a8e6cf', '#f5c87a', '#b8a9f5', '#7ac4f5', '#f2847a']
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div')
    el.className = 'confetti-piece'
    el.style.cssText = `
      left: ${x + (Math.random() - 0.5) * 80}px;
      top: ${y}px;
      background: ${colors[i % colors.length]};
      animation-delay: ${Math.random() * 0.2}s;
      width: ${6 + Math.random() * 6}px;
      height: ${6 + Math.random() * 6}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 1000)
  }
}

const ENCOURAGEMENTS = [
  '🎉 Keep the momentum!',
  '🔥 Streak extended!',
  '✨ Consistency is key!',
  '💪 Crushed it!',
  '🌱 Growing stronger!',
]

export default function HabitCard({ habit, showStreak = true, onEdit }) {
  const toggleCompletion = useHabitStore(s => s.toggleCompletion)
  const deleteHabit = useHabitStore(s => s.deleteHabit)
  const [isCompleting, setIsCompleting] = useState(false)
  const done = isTodayDone(habit)
  const streak = habit.streak || 0

  const handleToggle = (e) => {
    if (!done) {
      setIsCompleting(true)
      burstConfetti(e.clientX, e.clientY)
      const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
      toast(msg, { icon: null })
      setTimeout(() => setIsCompleting(false), 600)
    } else {
      toast('Habit unmarked', { icon: '↩️' })
    }
    toggleCompletion(habit.id)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    deleteHabit(habit.id)
    toast('Habit removed', { icon: '🗑️' })
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(habit)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: done ? 0.7 : 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={handleToggle}
      role="checkbox"
      aria-checked={done}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleToggle(e) } }}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isCompleting ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        outline: 'none',
      }}
    >
      {/* Ripple bg on complete */}
      <AnimatePresence>
        {isCompleting && (
          <motion.div
            initial={{ scale: 0, opacity: 0.2 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', top: '50%', left: 24,
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--accent)', transformOrigin: 'center',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Check circle */}
      <motion.div
        animate={{
          background: done ? 'var(--accent)' : 'transparent',
          borderColor: done ? 'var(--accent)' : 'var(--border)',
          scale: isCompleting ? [1, 1.3, 1] : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '2px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, zIndex: 1,
          fontSize: 16,
        }}
      >
        <AnimatePresence mode="wait">
          {done && (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              style={{ color: 'var(--bg)', fontWeight: 700, lineHeight: 1 }}
            >
              ✓
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Info */}
      <div style={{ flex: 1, zIndex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 500,
          color: done ? 'var(--text3)' : 'var(--text)',
          textDecoration: done ? 'line-through' : 'none',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {habit.emoji} {habit.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span className={`tag tag-${habit.category}`}>{habit.category}</span>
          {showStreak && streak > 0 && (
            <span style={{ fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Flame size={12} style={{ color: 'var(--amber)' }} /> {streak}d
            </span>
          )}
          {habit.reminder && (
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>🔔 {habit.reminder}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{ display: 'flex', gap: 4, zIndex: 1 }}
        className="habit-actions"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleEdit}
          aria-label="Edit habit"
          style={{
            width: 28, height: 28, borderRadius: 8,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text3)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Pencil size={12} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          aria-label="Delete habit"
          style={{
            width: 28, height: 28, borderRadius: 8,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text3)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Trash2 size={12} />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
