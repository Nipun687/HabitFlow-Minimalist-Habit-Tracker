import React from 'react'
import { motion } from 'framer-motion'

function StatCard({ num, label, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="card"
      style={{ flex: 1, padding: '14px 12px', textAlign: 'center' }}
    >
      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26 }}>{num}</div>
      <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, marginTop: 2, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {label}
      </div>
    </motion.div>
  )
}

export default function StatsRow({ done, total, bestStreak }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  return (
    <div style={{ display: 'flex', gap: 10, padding: '16px 20px' }}>
      <StatCard num={done} label="Done Today" delay={0} />
      <StatCard num={`${pct}%`} label="Completion" delay={0.05} />
      <StatCard num={bestStreak} label="Best Streak" delay={0.1} />
    </div>
  )
}
