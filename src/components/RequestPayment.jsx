import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { shortenAddress } from '../utils/ethereum'

const RequestPayment = ({ account, darkMode }) => {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [link, setLink] = useState('')

  const card = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow'
  const inner = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'
  const label = darkMode ? 'text-gray-400' : 'text-gray-500'
  const value = darkMode ? 'text-white' : 'text-gray-900'

  const generateLink = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    const base = window.location.origin
    const params = 'to=' + account + '&amount=' + amount + (note ? '&note=' + encodeURIComponent(note) : '')
    const generated = base + '/pay?' + params
    setLink(generated)
    toast.success('Payment link generated!')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(link)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className={'border rounded-2xl p-6 mb-6 ' + card}>
      <h2 className={'text-lg font-semibold mb-1 ' + value}>Request Payment</h2>
      <p className={label + ' text-xs mb-4'}>Generate a link to receive MATIC</p>

      <div className={'border rounded-xl p-3 mb-4 ' + inner}>
        <p className={label + ' text-xs mb-0.5'}>Your wallet</p>
        <p className={value + ' font-mono text-sm'}>{shortenAddress(account)}</p>
      </div>

      <div className="mb-4">
        <label className={label + ' text-xs mb-1 block'}>Amount to request (MATIC)</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={'w-full border rounded-xl px-4 py-3 text-sm outline-none ' + inner + ' ' + value}
        />
      </div>

      <div className="mb-6">
        <label className={label + ' text-xs mb-1 block'}>Note (optional)</label>
        <input
          type="text"
          placeholder="For freelance work..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={'w-full border rounded-xl px-4 py-3 text-sm outline-none ' + inner + ' ' + value}
        />
      </div>

      <button
        onClick={generateLink}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl transition-all mb-4"
      >
        Generate Payment Link
      </button>

      {link && (
        <div className={'border rounded-xl p-4 ' + inner}>
          <p className={label + ' text-xs mb-2'}>Your payment link</p>
          <p className={value + ' text-xs font-mono break-all mb-3'}>{link}</p>
          <button
            onClick={copyLink}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  )
}

export default RequestPayment