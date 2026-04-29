import React, { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CATEGORIES = {
  food:     { label: 'Food',     icon: '🍕', color: '#8247E5' },
  rent:     { label: 'Rent',     icon: '🏠', color: '#3B82F6' },
  work:     { label: 'Work',     icon: '💼', color: '#10B981' },
  personal: { label: 'Personal', icon: '👤', color: '#F59E0B' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#EF4444' },
  other:    { label: 'Other',    icon: '📦', color: '#6B7280' },
}

const Analytics = ({ transactions, darkMode }) => {
  const [period, setPeriod] = useState('month')

  const card = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow'
  const inner = darkMode ? 'bg-gray-800' : 'bg-gray-100'
  const label = darkMode ? 'text-gray-400' : 'text-gray-500'
  const value = darkMode ? 'text-white' : 'text-gray-900'

  const filterByPeriod = (txs) => {
    const now = new Date()
    return txs.filter((tx) => {
      const txDate = new Date(tx.timestamp)
      if (period === 'week') {
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
        return txDate >= weekAgo
      }
      if (period === 'month') {
        return txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
      }
      return true
    })
  }

  const filtered = filterByPeriod(transactions)
  const totalSpent = filtered.reduce((sum, tx) => sum + parseFloat(tx.amount), 0)

  const categoryData = Object.entries(
    filtered.reduce((acc, tx) => {
      const cat = tx.category || 'other'
      acc[cat] = (acc[cat] || 0) + parseFloat(tx.amount)
      return acc
    }, {})
  ).map(([cat, amount]) => ({
    name: CATEGORIES[cat]?.label || 'Other',
    icon: CATEGORIES[cat]?.icon || '📦',
    value: parseFloat(amount.toFixed(4)),
    color: CATEGORIES[cat]?.color || '#6B7280',
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={'p-2 rounded-lg border text-xs ' + (darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900')}>
          <p>{payload[0].name}</p>
          <p className="text-purple-400 font-bold">{payload[0].value} MATIC</p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11}>
        {(percent * 100).toFixed(0) + '%'}
      </text>
    )
  }

  return (
    <div className="space-y-4 mb-6">
      <div className={'border rounded-2xl p-6 ' + card}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={'text-lg font-semibold ' + value}>Analytics</h2>
          <div className={'flex gap-1 p-1 rounded-xl ' + inner}>
            {['week', 'month', 'all'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={
                  'px-3 py-1 rounded-lg text-xs font-medium transition-all ' +
                  (period === p
                    ? 'bg-purple-600 text-white'
                    : (darkMode ? 'text-gray-400' : 'text-gray-500'))
                }
              >
                {p === 'week' ? '7D' : p === 'month' ? '1M' : 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className={inner + ' rounded-xl p-3 text-center'}>
            <p className={label + ' text-xs mb-1'}>Transactions</p>
            <p className={'text-xl font-bold ' + value}>{filtered.length}</p>
          </div>
          <div className={inner + ' rounded-xl p-3 text-center'}>
            <p className={label + ' text-xs mb-1'}>Total Sent</p>
            <p className="text-xl font-bold text-purple-400">{totalSpent.toFixed(3)}</p>
            <p className={label + ' text-xs'}>MATIC</p>
          </div>
          <div className={inner + ' rounded-xl p-3 text-center'}>
            <p className={label + ' text-xs mb-1'}>Categories</p>
            <p className={'text-xl font-bold ' + value}>{categoryData.length}</p>
          </div>
        </div>

        {categoryData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">📊</p>
            <p className={label + ' text-sm'}>No transactions in this period</p>
          </div>
        ) : (
          <>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={CustomLabel}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {categoryData.map((cat, index) => {
                const pct = totalSpent > 0 ? ((cat.value / totalSpent) * 100).toFixed(1) : 0
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm">{cat.icon}</span>
                      <span className={value + ' text-sm'}>{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 text-sm font-medium">{cat.value} MATIC</span>
                      <span className={label + ' text-xs w-8 text-right'}>{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Analytics