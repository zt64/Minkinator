const { token } = require('./token.json')
const models = require('./models.js')
const config = require('./config.json')
const Discord = require('discord.js')
const fs = require('fs')

const client = new Discord.Client()

client.commands = new Discord.Collection()
client.cooldowns = new Discord.Collection()

client.discord = Discord
client.models = models
client.config = config

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    if (!file.endsWith('.js')) return
    const event = require(`./events/${file}`)
    const eventName = file.split('.')[0]
    client.on(eventName, event.bind(null, client))
    delete require.cache[require.resolve(`./events/${file}`)]
  })
})

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    if (!file.endsWith('.js')) return
    const props = require(`./commands/${file}`)
    const commandName = file.split('.')[0]
    client.commands.set(commandName, props)
  })
  console.log(`Succesfully loaded ${files.length} files.`)
})

client.login(token)
