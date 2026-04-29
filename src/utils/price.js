export const fetchMaticPrice = async () => {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd,inr'
    )
    const data = await res.json()
    return {
      usd: data['matic-network'].usd,
      inr: data['matic-network'].inr,
    }
  } catch (err) {
    console.error('Price fetch failed:', err)
    return { usd: 0, inr: 0 }
  }
}

export const fetchMaticHistory = async () => {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/matic-network/market_chart?vs_currency=usd&days=7&interval=daily'
    )
    const data = await res.json()
    return data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
      price: parseFloat(price.toFixed(4)),
    }))
  } catch (err) {
    console.error('History fetch failed:', err)
    return []
  }
}