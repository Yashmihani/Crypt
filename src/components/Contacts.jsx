import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'

const Contacts = ({ darkMode, onSelectContact }) => {
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [showForm, setShowForm] = useState(false)

  const card = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200 shadow'
  const inner = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'
  const label = darkMode ? 'text-gray-400' : 'text-gray-500'
  const value = darkMode ? 'text-white' : 'text-gray-900'
  const itemBg = darkMode ? 'bg-gray-800' : 'bg-gray-50 border border-gray-200'

  useEffect(() => {
    const saved = localStorage.getItem('MATIC-Pay_contacts')
    if (saved) setContacts(JSON.parse(saved))
  }, [])

  const saveContacts = (updated) => {
    setContacts(updated)
    localStorage.setItem('MATIC-Pay_contacts', JSON.stringify(updated))
  }

  const addContact = () => {
    if (!name.trim()) {
      toast.error('Please enter a name')
      return
    }
    if (!ethers.isAddress(address)) {
      toast.error('Invalid wallet address')
      return
    }
    const exists = contacts.find((c) => c.address.toLowerCase() === address.toLowerCase())
    if (exists) {
      toast.error('Contact already exists')
      return
    }
    const newContact = {
      id: Date.now(),
      name: name.trim(),
      address,
    }
    saveContacts([...contacts, newContact])
    setName('')
    setAddress('')
    setShowForm(false)
    toast.success('Contact saved!')
  }

  const deleteContact = (id) => {
    const updated = contacts.filter((c) => c.id !== id)
    saveContacts(updated)
    toast.success('Contact deleted')
  }

  const shortenAddress = (addr) => {
    if (!addr) return ''
    return addr.slice(0, 6) + '...' + addr.slice(-4)
  }

  const getInitial = (n) => n.charAt(0).toUpperCase()

  return (
    <div className={'border rounded-2xl p-6 mb-6 ' + card}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={'text-lg font-semibold ' + value}>Contacts</h2>
          <p className={label + ' text-xs'}>Save wallet addresses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <div className={'border rounded-xl p-4 mb-4 ' + inner}>
          <p className={value + ' text-sm font-medium mb-3'}>New Contact</p>
          <div className="mb-3">
            <label className={label + ' text-xs mb-1 block'}>Name</label>
            <input
              type="text"
              placeholder="Rahul, Mom, Client..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={'w-full border rounded-xl px-4 py-3 text-sm outline-none ' + inner + ' ' + value}
            />
          </div>
          <div className="mb-4">
            <label className={label + ' text-xs mb-1 block'}>Wallet address</label>
            <input
              type="text"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={'w-full border rounded-xl px-4 py-3 text-sm outline-none font-mono ' + inner + ' ' + value}
            />
          </div>
          <button
            onClick={addContact}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            Save Contact
          </button>
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">👥</p>
          <p className={label + ' text-sm'}>No contacts yet</p>
          <p className={label + ' text-xs mt-1'}>Add contacts to send MATIC easily</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className={itemBg + ' rounded-xl p-4'}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {getInitial(contact.name)}
                  </div>
                  <div>
                    <p className={value + ' text-sm font-medium'}>{contact.name}</p>
                    <p className={label + ' text-xs font-mono'}>{shortenAddress(contact.address)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {onSelectContact && (
                    <button
                      onClick={() => onSelectContact(contact)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    >
                      Send
                    </button>
                  )}
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="bg-red-900 hover:bg-red-800 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Contacts