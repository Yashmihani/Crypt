import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { sendPaymentContract } from '../utils/contract'
import { toast } from 'react-toastify'

const PayPage = ({ darkMode }) => {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [txHash, setTxHash] = useState(null)

  const bg = darkMode ? 'bg-gray-950' : 'bg-gray-100'
  const card = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow'
  const inner = darkMode ? 'bg-gray-800' : 'bg-gray-100'
  const label = darkMode ? 'text-gray-400' : 'text-gray-500'
  const value = darkMode ? 'text-white' : 'text-gray-900'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setTo(params.get('to') || '')
    setAmount(params.get('amount') || '')
    setNote(params.get('note') || '')
  }, [])

  const shortenAddress = (addr) => {
    if (!addr) return ''
    return addr.slice(0, 6) + '...' + addr.slice(-4)
  }

  const handlePay = async () => {
    if (!to || !amount) {
      toast.error('Missing payment details')
      return
    }
    setIsSending(true)
    try {
      const tx = await sendPaymentContract(to, amount, note || 'Payment via link')
      setTxHash(tx.hash)
      toast.success('Payment sent successfully!')
    } catch (err) {
      if (err.code === 4001) {
        toast.error('Rejected by user')
      } else {
        toast.error('Payment failed')
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className={'min-h-screen flex items-center justify-center px-4 ' + bg}>
      <div className={'border rounded-2xl p-6 w-full max-w-md ' + card}>
        <div className="text-center mb-6">
          <span className="text-4xl">💎</span>
          <h1 className="text-2xl font-bold mt-2">
            <span className="text-purple-400">CryptPay</span>
          </h1>
          <p className={label + ' text-sm mt-1'}>Payment Request</p>
        </div>

        <div className={inner + ' rounded-xl p-4 mb-4'}>
          <p className={label + ' text-xs mb-1'}>Paying to</p>
          <p className={value + ' font-mono text-sm'}>{shortenAddress(to)}</p>
        </div>

        <div className={inner + ' rounded-xl p-4 mb-4'}>
          <p className={label + ' text-xs mb-1'}>Amount</p>
          <p className={'text-3xl font-bold text-purple-400'}>{amount} MATIC</p>
        </div>

        {note && (
          <div className={inner + ' rounded-xl p-4 mb-4'}>
            <p className={label + ' text-xs mb-1'}>Note</p>
            <p className={value + ' text-sm italic'}>"{note}"</p>
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={isSending}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white font-semibold py-4 rounded-xl transition-all"
        >
          {isSending ? 'Sending...' : 'Pay ' + amount + ' MATIC'}
        </button>

        {txHash && (
          <div className={'mt-4 p-3 rounded-xl ' + inner}>
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
    </div>
  )
}

export default PayPage