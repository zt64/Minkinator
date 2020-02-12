
const functions = require('./lib/functions.js');
const config = require('./config/config.json');
const models = require('./lib/models.js');

const GifEncoder = require('gif-encoder');
const Sequelize = require('sequelize');
const discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
const canvas = require('canvas');
const colors = require('colors');
const qr = require('qrcode');
const fs = require('fs');

const client = new discord.Client({ fetchAllMembers: true });

client.coolDowns = new discord.Collection();
client.commands = new discord.Collection();
client.events = new discord.Collection();

client.GifEncoder = GifEncoder;
client.Sequelize = Sequelize;
client.discord = discord;
client.moment = moment;
client.canvas = canvas;
client.colors = colors;
client.fetch = fetch;
client.qr = qr;
client.fs = fs;

client.functions = functions;
client.models = models;
client.config = config;

client.loadEvents = function loadEvents () {
  fs.readdirSync('./events/').forEach(eventName => {
    delete require.cache[require.resolve(`./events/${eventName}`)];

    const eventFile = require(`./events/${eventName}`);

    eventName = eventName.replace('.js', '');

    client.events.set(eventName, eventFile);

    client.on(eventName, eventFile.bind(null, client));
  });
  console.log(`Successfully loaded ${client.events.size} events.`);
};

client.loadCommands = function loadCommands () {
  fs.readdirSync('./commands/').forEach(category => {
    fs.readdirSync(`./commands/${category}`).forEach(async commandName => {
      delete require.cache[require.resolve(`./commands/${category}/${commandName}`)];

      const commandFile = require(`./commands/${category}/${commandName}`);

      commandName = commandName.replace('.js', '');

      client.commands.set(commandName, commandFile);

      const command = client.commands.get(commandName);

      command.name = commandName;
      command.category = category;

      if (category === 'owner') command.ownerOnly = true;
    });
  });
  console.log(`Successfully loaded ${client.commands.size} commands.`);
};

client.loadEvents();
client.loadCommands();

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise);
});

process.stdin.on('data', async data => {
  try {
    console.log(await eval(`(async()=>{${data.toString()}})()`));
  } catch (e) {
    console.log(e.message);
  }
});

client.login(config.token);