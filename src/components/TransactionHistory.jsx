import React from 'react'
import { shortenAddress } from '../utils/ethereum'

const CATEGORY_MAP = {
  food:     { label: 'Food',     icon: '🍕' },
  rent:     { label: 'Rent',     icon: '🏠' },
  work:     { label: 'Work',     icon: '💼' },
  personal: { label: 'Personal', icon: '👤' },
  shopping: { label: 'Shopping', icon: '🛍️' },
  other:    { label: 'Other',    icon: '📦' },
}

const TransactionHistory = ({ transactions, darkMode }) => {
  const card = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow'
  const inner = darkMode ? 'bg-gray-800' : 'bg-gray-50 border border-gray-200'
  const label = darkMode ? 'text-gray-400' : 'text-gray-500'
  const value = darkMode ? 'text-white' : 'text-gray-900'

  const getSpendingByCategory = () => {
    const totals = {}
    transactions.forEach((tx) => {
      const cat = tx.category || 'other'
      totals[cat] = (totals[cat] || 0) + parseFloat(tx.amount)
    })
    return totals
  }

  const totalSpent = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
  const spending = getSpendingByCategory()

  if (transactions.length === 0) {
    return (
      <div className={'border rounded-2xl p-6 ' + card}>
        <h2 className={'text-lg font-semibold mb-4 ' + value}>Transaction History</h2>
        <p className={label + ' text-sm text-center py-8'}>No transactions yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className={'border rounded-2xl p-6 ' + card}>
        <h2 className={'text-lg font-semibold mb-4 ' + value}>Spending Breakdown</h2>
        <div className="space-y-3">
          {Object.entries(spending).map(([cat, amount]) => {
            const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
            const info = CATEGORY_MAP[cat] || CATEGORY_MAP.other
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span>{info.icon}</span>
                    <span className={value + ' text-sm'}>{info.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 text-sm font-semibold">
                      {amount.toFixed(4)} MATIC
                    </span>
                    <span className={label + ' text-xs'}>{pct}%</span>
                  </div>
                </div>
                <div className={darkMode ? 'bg-gray-700' : 'bg-gray-200' + ' rounded-full h-1.5'}>
                  <div
                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: pct + '%' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className={'mt-4 pt-4 border-t ' + (darkMode ? 'border-gray-700' : 'border-gray-200')}>
          <div className="flex justify-between">
            <span className={label + ' text-sm'}>Total spent</span>
            <span className={value + ' text-sm font-bold'}>{totalSpent.toFixed(4)} MATIC</span>
          </div>
        </div>
      </div>

      <div className={'border rounded-2xl p-6 ' + card}>
        <h2 className={'text-lg font-semibold mb-4 ' + value}>All Transactions</h2>
        <div className="space-y-3">
          {transactions.map((tx, index) => {
            const cat = CATEGORY_MAP[tx.category] || CATEGORY_MAP.other
            return (
              <div key={index} className={inner + ' rounded-xl p-4'}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center text-xl">
                      {cat.icon}
                    </div>
                    <div>
                      <p className={value + ' text-sm font-medium'}>
                        {cat.label}
                      </p>
                      <p className={label + ' text-xs'}>
                        To: {shortenAddress(tx.recipient)}
                      </p>
                      {tx.message && (
                        <p className={label + ' text-xs italic'}>"{tx.message}"</p>
                      )}
                      <p className={label + ' text-xs'}>
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-400 font-semibold">-{tx.amount} MATIC</p>
                    <a
                      href={'https://amoy.polygonscan.com/tx/' + tx.hash}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={label + ' text-xs hover:text-purple-400 block mt-1'}
                    >
                      View tx
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory