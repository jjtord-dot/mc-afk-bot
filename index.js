const mineflayer = require('mineflayer')

function startBot() {
  console.log('Connecting bot to BaoHost...')
  const bot = mineflayer.createBot({
    host: 'aegis-smp.playwithbao.com',  // SERVER MO TO
    port: 35215,                        // PORT MO TO
    username: 'AFK_Player',             // Palitan mo ng mukhang real
    auth: 'offline',                    // 'microsoft' kung premium MC
    version: false                      // Auto detect version ng server mo
  })

  bot.on('login', () => console.log('Logged in sa BaoHost!'))
  
  bot.on('spawn', () => {
    console.log('Bot nasa server na! Uptime started')
    // Anti-AFK: galaw every 40 sec para di ma-kick
    setInterval(() => {
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 400)
    }, 40000)
    
    // Random look around
    setInterval(() => {
      bot.look(Math.random() * Math.PI * 2, 0)
    }, 12000)
    
    // Random sneak para mukhang player
    setInterval(() => {
      bot.setControlState('sneak', true)
      setTimeout(() => bot.setControlState('sneak', false), 1000)
    }, 90000)
  })

  bot.on('kicked', (reason) => {
    console.log('Na-kick:', reason)
    setTimeout(startBot, 30000) // Try ulit after 30s
  })
  
  bot.on('error', (err) => {
    console.log('Error:', err.message)
    setTimeout(startBot, 30000)
  })
  
  bot.on('end', () => {
    console.log('Disconnected. Reconnecting...')
    setTimeout(startBot, 30000)
  })
}

startBot()

// Express server para kay Render - Required to
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
app.get('/', (req, res) => res.send('BaoHost AFK Bot Running'))
app.listen(PORT, () => console.log(`Keep-alive on port ${PORT}`))
