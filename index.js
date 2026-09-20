const mineflayer = require('mineflayer')
const express = require('express')

let bot = null
let reconnecting = false

function startBot() {
  if (reconnecting) return // Prevent duplicate bots
  reconnecting = true
  
  console.log('[BOT] Connecting to BaoHost...')
  
  bot = mineflayer.createBot({
    host: 'aegis-smp.playwithbao.com', 
    port: 35215,                       
    username: 'Starter',             // PALITAN MO NG UNIQUE NAME
    auth: 'offline',                   // 'microsoft' kung online-mode=true
    version: '1.20.1',                 // SAKTO SA SERVER VERSION MO
    checkTimeoutInterval: 60000,       // 60s timeout para di ma-disconnect agad
    hideErrors: false
  })

  bot.on('login', () => {
    console.log('[BOT] Successfully logged in!')
    reconnecting = false
  })
  
  bot.on('spawn', () => {
    console.log('[BOT] Bot spawned! ZERO MOVEMENT MODE - tatayo lang')
    // WALA NANG SETINTERVAL - WALANG GALAW PARA DI MA-KICK
    // Si BaoHost di naman nagki-kick pag naka-stand lang
  })

  bot.on('kicked', (reason) => {
    console.log('[BOT] Kicked:', reason)
    destroyBot()
    console.log('[BOT] Reconnecting in 2 minutes...')
    setTimeout(() => {
      reconnecting = false
      startBot()
    }, 120000) // 2 mins delay para di ma-spam ban
  })
  
  bot.on('error', (err) => {
    console.log('[BOT] Error:', err.message)
    destroyBot()
    setTimeout(() => {
      reconnecting = false
      startBot()
    }, 120000)
  })
  
  bot.on('end', (reason) => {
    console.log('[BOT] Disconnected:', reason)
    destroyBot()
    setTimeout(() => {
      reconnecting = false
      startBot()
    }, 120000)
  })
}

function destroyBot() {
  if (bot) {
    try {
      bot.quit()
      bot.end()
    } catch (e) {}
    bot = null
  }
}

// Start bot after 5 sec para sure na wala nang old instance
setTimeout(startBot, 5000)

// Express server para kay Render
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({ 
    status: bot ? 'connected' : 'connecting',
    botName: 'Steve_092',
    uptime: process.uptime()
  })
})

app.listen(PORT, () => {
  console.log(`[SERVER] Keep-alive running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[BOT] Shutting down...')
  destroyBot()
  process.exit(0)
})
