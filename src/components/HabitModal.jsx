import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useHabitStore } from '@/store/useHabitStore'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'health', label: '🌿 Health' },
  { id: 'mind',   label: '🧠 Mind' },
  { id: 'work',   label: '💼 Work' },
  { id: 'body',   label: '💪 Body' },
  { id: 'social', label: '💬 Social' },
]

const EMOJIS = ['🧘','📚','🏃','💧','😴','🥗','✍️','🎯','🎨','🌅','🎵','🌿','🧘','🏋️','🚴','🤸','🧘','🌊','⭐','🎉']

export default function HabitModal({ isOpen, onClose, editHabit }) {
  const addHabit = useHabitStore(s => s.addHabit)
  const updateHabit = useHabitStore(s => s.updateHabit)
  const nameRef = useRef(null)

  const [form, setForm] = useState({
    name: '', category: 'health', emoji: '🎯', reminder: '',
  })

  useEffect(() => {
    if (isOpen) {
      if (editHabit) {
        setForm({ name: editHabit.name, category: editHabit.category, emoji: editHabit.emoji, reminder: editHabit.reminder || '' })
      } else {
        setForm({ name: '', category: 'health', emoji: '🎯', reminder: '' })
      }
      setTimeout(() => nameRef.current?.focus(), 350)
    }
  }, [isOpen, editHabit])

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Please enter a habit name'); return }
    if (editHabit) {
      updateHabit(editHabit.id, form)
      toast.success('Habit updated ✓')
    } else {
      addHabit(form)
      toast.success('Habit created 🌱')
    }
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
              width: '100%', maxWidth: 440,
              background: 'var(--surface)',
              borderRadius: '24px 24px 0 0',
              padding: '0 20px 40px',
              zIndex: 201, maxHeight: '90vh', overflowY: 'auto',
            }}
          >
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
              <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 4 }} />
            </div>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 20px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22 }}>
                {editHabit ? 'Edit Habit' : 'New Habit'}
              </h2>
              <button
                onClick={onClose}
                className="btn-icon"
                style={{ width: 32, height: 32 }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>
                Habit Name
              </label>
              <input
                ref={nameRef}
                type="text"
                className="input"
                style={{ padding: '12px 14px', fontSize: 15 }}
                placeholder="e.g. Morning meditation"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                onKeyDown={handleKeyDown}
                maxLength={60}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>
                Category
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CATEGORIES.map(cat => (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                    className={form.category === cat.id ? `tag tag-${cat.id}` : ''}
                    style={{
                      padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                      border: `1px solid ${form.category === cat.id ? 'currentColor' : 'var(--border)'}`,
                      background: form.category === cat.id ? undefined : 'transparent',
                      color: form.category === cat.id ? undefined : 'var(--text2)',
                      fontSize: 12, fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Emoji */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>
                Icon
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {EMOJIS.map((emoji, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setForm(f => ({ ...f, emoji }))}
                    style={{
                      width: 40, height: 40, borderRadius: 10, fontSize: 20, cursor: 'pointer',
                      border: `1px solid ${form.emoji === emoji ? 'var(--accent)' : 'var(--border)'}`,
                      background: form.emoji === emoji ? 'rgba(168,230,207,0.15)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Reminder */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>
                Reminder (optional)
              </label>
              <input
                type="time"
                className="input"
                style={{ padding: '12px 14px', fontSize: 15 }}
                value={form.reminder}
                onChange={e => setForm(f => ({ ...f, reminder: e.target.value }))}
              />
            </div>

            {/* Save button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 'var(--radius-sm)' }}
              onClick={handleSave}
            >
              {editHabit ? 'Update Habit' : 'Create Habit'}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
