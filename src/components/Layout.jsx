import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Sparkles, BarChart2, List, Calendar } from 'lucide-react'
import { useHabitStore } from '@/store/useHabitStore'

const NAV_ITEMS = [
  { to: '/today',    label: 'Today',    Icon: Calendar },
  { to: '/progress', label: 'Progress', Icon: BarChart2 },
  { to: '/all',      label: 'All',      Icon: List },
]

export default function Layout({ children }) {
  const toggleTheme = useHabitStore(s => s.toggleTheme)
  const theme = useHabitStore(s => s.theme)
  const location = useLocation()

  return (
    <div className="app-container">
      {/* ── Top Nav ── */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(12px)',
          padding: '18px 20px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, letterSpacing: -0.5 }}>
          Habit<span style={{ color: 'var(--accent)' }}>Flow</span>
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="btn-icon"
            style={{ width: 38, height: 38 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex' }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* ── Page Content ── */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* ── Bottom Nav ── */}
      <nav
        style={{
          position: 'fixed', bottom: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '100%', maxWidth: 440,
          background: 'var(--bg)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          paddingBottom: 'env(safe-area-inset-bottom, 8px)',
          zIndex: 100,
        }}
      >
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3,
              padding: '10px 8px 8px',
              textDecoration: 'none',
              color: isActive ? 'var(--accent)' : 'var(--text3)',
              fontSize: 10, fontWeight: 500,
              transition: 'color 0.2s',
              position: 'relative',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute', top: 0, left: '25%', right: '25%',
                      height: 2, background: 'var(--accent)', borderRadius: 2,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
