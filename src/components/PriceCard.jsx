import React, { useState, useEffect } from 'react'
import { fetchMaticPrice, fetchMaticHistory } from '../utils/price'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const PriceCard = ({ balance, darkMode }) => {
  const [price, setPrice] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [change, setChange] = useState(0)

  const card = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow'
  const inner = darkMode ? 'bg-gray-800' : 'bg-gray-100'
  const label = darkMode ? 'text-gray-400' : 'text-gray-500'
  const value = darkMode ? 'text-white' : 'text-gray-900'

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [p, h] = await Promise.all([fetchMaticPrice(), fetchMaticHistory()])
      setPrice(p)
      setHistory(h)
      if (h.length >= 2) {
        const first = h[0].price
        const last = h[h.length - 1].price
        const pct = ((last - first) / first) * 100
        setChange(parseFloat(pct.toFixed(2)))
      }
      setLoading(false)
    }
    load()
    const interval = setInterval(load, 60000)
    return () => clearInterval(interval)
  }, [])

  const balanceUSD = price && balance ? (parseFloat(balance) * price.usd).toFixed(2) : '0.00'
  const balanceINR = price && balance ? (parseFloat(balance) * price.inr).toFixed(2) : '0.00'
  const isPositive = change >= 0

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={'p-2 rounded-lg border text-xs ' + (darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900')}>
          ${payload[0].value}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className={'border rounded-2xl p-6 mb-6 ' + card}>
        <div className="animate-pulse space-y-3">
          <div className={inner + ' h-4 w-32 rounded-lg'} />
          <div className={inner + ' h-8 w-24 rounded-lg'} />
          <div className={inner + ' h-24 w-full rounded-lg'} />
        </div>
      </div>
    )
  }

  return (
    <div className={'border rounded-2xl p-6 mb-6 ' + card}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={label + ' text-xs mb-1'}>MATIC Price</p>
          <div className="flex items-center gap-2">
            <p className={'text-2xl font-bold ' + value}>${price?.usd}</p>
            <span className={
              'text-xs font-semibold px-2 py-0.5 rounded-full ' +
              (isPositive ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400')
            }>
              {isPositive ? '+' : ''}{change}%
            </span>
          </div>
          <p className={label + ' text-xs mt-0.5'}>₹{price?.inr} · 7 day change</p>
        </div>
        <div className="text-right">
          <p className={label + ' text-xs mb-1'}>Your value</p>
          <p className={'text-lg font-bold text-purple-400'}>${balanceUSD}</p>
          <p className={label + ' text-xs'}>₹{balanceINR}</p>
        </div>
      </div>

      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8247E5"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#8247E5' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-2">
        <p className={label + ' text-xs'}>7 days ago</p>
        <p className={label + ' text-xs'}>Today</p>
      </div>
    </div>
  )
}

export default PriceCard