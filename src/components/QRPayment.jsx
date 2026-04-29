import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'react-toastify'
import { shortenAddress } from '../utils/ethereum'

const QRPayment = ({ account, darkMode }) => {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [showQR, setShowQR] = useState(false)

  const card = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow'
  const inner = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'
  const label = darkMode ? 'text-gray-400' : 'text-gray-500'
  const value = darkMode ? 'text-white' : 'text-gray-900'

  const qrValue = window.location.origin +
    '/pay?to=' + account +
    '&amount=' + amount +
    (note ? '&note=' + encodeURIComponent(note) : '')

  const generateQR = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    setShowQR(true)
    toast.success('QR Code generated!')
  }

  const downloadQR = () => {
    const svg = document.getElementById('qr-code')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 300
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, 300, 300)
      ctx.drawImage(img, 0, 0, 300, 300)
      const a = document.createElement('a')
      a.download = 'cryptpay-qr.png'
      a.href = canvas.toDataURL('image/png')
      a.click()
      toast.success('QR Code downloaded!')
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className={'border rounded-2xl p-6 mb-6 ' + card}>
      <h2 className={'text-lg font-semibold mb-1 ' + value}>QR Payment</h2>
      <p className={label + ' text-xs mb-4'}>Generate a QR code to receive MATIC</p>

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
          onChange={(e) => {
            setAmount(e.target.value)
            setShowQR(false)
          }}
          className={'w-full border rounded-xl px-4 py-3 text-sm outline-none ' + inner + ' ' + value}
        />
      </div>

      <div className="mb-6">
        <label className={label + ' text-xs mb-1 block'}>Note (optional)</label>
        <input
          type="text"
          placeholder="For freelance work..."
          value={note}
          onChange={(e) => {
            setNote(e.target.value)
            setShowQR(false)
          }}
          className={'w-full border rounded-xl px-4 py-3 text-sm outline-none ' + inner + ' ' + value}
        />
      </div>

      <button
        onClick={generateQR}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl transition-all mb-4"
      >
        Generate QR Code
      </button>

      {showQR && (
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl mb-4 shadow-lg">
            <QRCodeSVG
              id="qr-code"
              value={qrValue}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
            />
          </div>

          <div className={'w-full border rounded-xl p-3 mb-3 text-center ' + inner}>
            <p className={label + ' text-xs mb-1'}>Requesting</p>
            <p className="text-purple-400 text-2xl font-bold">{amount} MATIC</p>
            {note && <p className={label + ' text-xs mt-1 italic'}>"{note}"</p>}
          </div>

          <button
            onClick={downloadQR}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  )
}

export default QRPayment