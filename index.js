const mineflayer = require('mineflayer')
const express = require('express')

function startBot() {
  console.log('[BOT] Starting connection to BaoHost...')
  
  const bot = mineflayer.createBot({
    host: 'aegis-smp.playwithbao.com', 
    port: 35215,                       
    username: 'Steve_092',             // PALITAN MO - wag AFK_Player
    auth: 'offline',                   // Gawin 'microsoft' kung naka online-mode=true
    version: '1.20.1',                 // PALITAN MO NG VERSION NG SERVER MO
    hideErrors: false
  })

  bot.on('login', () => {
    console.log('[BOT] Successfully logged in!')
  })
  
  bot.on('spawn', () => {
    console.log('[BOT] Bot spawned in server! Starting anti-AFK...')
    
    // Wait 10 seconds bago gumalaw para di ma-flag ng anticheat
    setTimeout(() => {
      console.log('[BOT] Anti-AFK activated')
      
      // MABAGAL NA JUMP - Every 3 minutes lang para safe
      setInterval(() => {
        if (bot.entity) {
          bot.setControlState('jump', true)
          setTimeout(() => bot.setControlState('jump', false), 250)
        }
      }, 180000) // 3 minutes
      
      // SOBRANG SLOW NA LOOK - konting lingon lang
      setInterval(() => {
        if (bot.entity) {
          const yaw = bot.entity.yaw + (Math.random() - 0.5) * 0.2
          const pitch = (Math.random() - 0.5) * 0.1
          bot.look(yaw, pitch, false)
        }
      }, 45000) // 45 seconds
      
      // Random sneak minsan para mukhang player
      setInterval(() => {
        if (bot.entity && Math.random() > 0.7) {
          bot.setControlState('sneak', true)
          setTimeout(() => bot.setControlState('sneak', false), 2000)
        }
      }, 120000) // 2 minutes, 30% chance lang
      
    }, 10000) // 10 sec delay bago mag-start
  })

  bot.on('kicked', (reason) => {
    console.log('[BOT] Kicked from server:', reason)
    console.log('[BOT] Reconnecting in 60 seconds...')
    setTimeout(startBot, 60000) // 1 min delay para di ma-spam
  })
  
  bot.on('error', (err) => {
    console.log('[BOT] Error occurred:', err.message)
    console.log('[BOT] Reconnecting in 60 seconds...')
    setTimeout(startBot, 60000)
  })
  
  bot.on('end', (reason) => {
    console.log('[BOT] Disconnected:', reason)
    console.log('[BOT] Reconnecting in 60 seconds...')
    setTimeout(startBot, 60000)
  })
}

// Start mo bot
startBot()

// Express server para kay Render - REQUIRED ITO
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'BaoHost AFK Bot is running!',
    uptime: process.uptime()
  })
})

app.listen(PORT, () => {
  console.log(`[SERVER] Keep-alive server running on port ${PORT}`)
})
