import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { sendPaymentContract } from '../utils/contract'
import { toast } from 'react-toastify'

const CATEGORIES = [
  { id: 'food', label: 'Food', icon: '🍕' },
  { id: 'rent', label: 'Rent', icon: '🏠' },
  { id: 'work', label: 'Work', icon: '💼' },
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'other', label: 'Other', icon: '📦' },
]

const SendMatic = ({ onTransactionSent, darkMode, selectedContact, onClearContact }) => {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('other')
  const [isSending, setIsSending] = useState(false)
  const [txHash, setTxHash] = useState(null)

  const card = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow'
  const inner = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'
  const label = darkMode ? 'text-gray-400' : 'text-gray-500'
  const value = darkMode ? 'text-white' : 'text-gray-900'

  useEffect(() => {
    if (selectedContact) {
      setRecipient(selectedContact.address)
      setMessage('Payment to ' + selectedContact.name)
    }
  }, [selectedContact])

  const sendMatic = async () => {
    if (!recipient || !amount) {
      toast.error('Please fill in all fields')
      return
    }
    if (!ethers.isAddress(recipient)) {
      toast.error('Invalid wallet address')
      return
    }
    const amountNum = parseFloat(amount)
    if (amountNum <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }
    setIsSending(true)
    setTxHash(null)
    try {
      const tx = await sendPaymentContract(recipient, amount, message || 'Payment')
      toast.info('Transaction sent! Waiting...')
      setTxHash(tx.hash)
      toast.success('Payment confirmed!')
      onTransactionSent(tx.hash, recipient, amount, message, category)
      setRecipient('')
      setAmount('')
      setMessage('')
      setCategory('other')
      if (onClearContact) onClearContact()
    } catch (err) {
      if (err.code === 4001) {
        toast.error('Rejected by user')
      } else {
        toast.error('Transaction failed')
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className={'border rounded-2xl p-6 mb-6 ' + card}>
      <h2 className={'text-lg font-semibold mb-4 ' + value}>Send MATIC</h2>

      {selectedContact && (
        <div className="bg-purple-900 border border-purple-700 rounded-xl p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
              {selectedContact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{selectedContact.name}</p>
              <p className="text-purple-300 text-xs font-mono">
                {selectedContact.address.slice(0, 6) + '...' + selectedContact.address.slice(-4)}
              </p>
            </div>
          </div>
          <button
            onClick={onClearContact}
            className="text-purple-400 hover:text-white text-xs transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      <div className="mb-4">
        <label className={label + ' text-xs mb-1 block'}>Recipient address</label>
        <input
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className={'w-full border rounded-xl px-4 py-3 text-sm outline-none font-mono ' + inner + ' ' + value}
        />
      </div>

      <div className="mb-4">
        <label className={label + ' text-xs mb-1 block'}>Amount (MATIC)</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={'w-full border rounded-xl px-4 py-3 text-sm outline-none ' + inner + ' ' + value}
        />
      </div>

      <div className="mb-4">
        <label className={label + ' text-xs mb-1 block'}>Message (optional)</label>
        <input
          type="text"
          placeholder="Payment for..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={'w-full border rounded-xl px-4 py-3 text-sm outline-none ' + inner + ' ' + value}
        />
      </div>

      <div className="mb-6">
        <label className={label + ' text-xs mb-2 block'}>Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={
                'flex flex-col items-center gap-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ' +
                (category === cat.id
                  ? 'border-purple-500 bg-purple-900 text-purple-300'
                  : (darkMode
                    ? 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
                    : 'border-gray-300 bg-gray-100 text-gray-500 hover:border-gray-400'))
              }
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={sendMatic}
        disabled={isSending}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white font-semibold py-4 rounded-xl transition-all"
      >
        {isSending ? 'Sending...' : 'Send MATIC'}
      </button>

      {txHash && (
        <div className={'mt-4 p-3 rounded-xl ' + (darkMode ? 'bg-gray-800' : 'bg-gray-100')}>
          <p className={label + ' text-xs mb-1'}>Transaction hash</p>
          <a
            href={'https://amoy.polygonscan.com/tx/' + txHash}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 text-xs font-mono hover:underline break-all"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  )
}

export default SendMatic