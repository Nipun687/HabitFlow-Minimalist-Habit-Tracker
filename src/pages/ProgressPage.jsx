import React from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { format, subDays } from 'date-fns'
import { useHabitStore, getMonthCompletion, getWeekData, isTodayDone } from '@/store/useHabitStore'

function getWeekChartData(habits) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i)
    const key = format(d, 'yyyy-MM-dd')
    const done = habits.filter(h => h.completions[key]).length
    return { day: format(d, 'EEE'), done, total: habits.length, pct: habits.length ? Math.round((done / habits.length) * 100) : 0 }
  })
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', fontSize: 12 }}>
      <div style={{ color: 'var(--text2)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--accent)', fontWeight: 600 }}>{payload[0].value}% completion</div>
    </div>
  )
}

export default function ProgressPage() {
  const habits = useHabitStore(s => s.habits)
  const weekData = getWeekChartData(habits)
  const avgPct = habits.length ? habits.reduce((s, h) => s + getMonthCompletion(h), 0) / habits.length : 0
  const todayDone = habits.filter(isTodayDone).length

  return (
    <div style={{ padding: '20px 20px 0' }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 20 }}
      >
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, marginBottom: 4 }}>Your Progress</div>
        <div style={{ fontSize: 14, color: 'var(--text2)' }}>
          {habits.length === 0 ? 'Add habits to track your progress.' : `${todayDone} of ${habits.length} completed today`}
        </div>
      </motion.div>

      {habits.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, marginBottom: 8 }}>No data yet</div>
          <div style={{ fontSize: 14, color: 'var(--text3)' }}>Complete some habits to see your progress.</div>
        </div>
      ) : (
        <>
          {/* 7-day chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
            style={{ padding: '16px', marginBottom: 16 }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 16 }}>
              7-Day Completion Rate
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={weekData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="pct" stroke="var(--accent)" strokeWidth={2} fill="url(#accentGrad)" dot={{ fill: 'var(--accent)', strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Per-habit progress */}
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>
            30-Day Per Habit
          </div>

          {habits.map((habit, i) => {
            const pct = getMonthCompletion(habit)
            const week = getWeekData(habit)
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card"
                style={{ padding: '14px 16px', marginBottom: 10 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {habit.emoji} {habit.name}
                    <span className={`tag tag-${habit.category}`}>{habit.category}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{pct}%</div>
                </div>

                <div className="progress-bg" style={{ height: 6, marginBottom: 10 }}>
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: i * 0.05 }}
                    style={{ height: '100%' }}
                  />
                </div>

                {/* Week dots */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {week.map((d, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 + j * 0.03 }}
                      title={`${d.day}: ${d.done ? 'Done' : 'Missed'}`}
                      style={{
                        flex: 1, height: 8, borderRadius: 3,
                        background: d.done ? 'var(--accent)' : 'var(--border)',
                        border: d.isToday ? '1px solid var(--accent)' : 'none',
                        transition: 'background 0.3s',
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  {week.map((d, j) => (
                    <span key={j} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: d.isToday ? 'var(--accent)' : 'var(--text3)' }}>
                      {d.day[0]}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}

          {/* Insight card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'linear-gradient(135deg, rgba(168,230,207,0.08), rgba(184,169,245,0.08))',
              border: '1px solid rgba(168,230,207,0.2)',
              borderRadius: 'var(--radius)', padding: 16, margin: '16px 0',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 6 }}>
              ✦ Monthly Insight
            </div>
            <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>
              Your average completion rate is{' '}
              <strong style={{ color: 'var(--text)' }}>{Math.round(avgPct)}%</strong> over the last 30 days.{' '}
              {avgPct >= 70 ? 'Exceptional consistency — you\'re in the top tier! 🏆' : avgPct >= 40 ? 'Good progress. Push for 70%+ this week! 💪' : 'Every day is a new start. Build momentum! 🌱'}
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
