
const functions = require('./lib/functions.js');
const { token } = require('./token.json');
const config = require('./config.json');
const models = require('./lib/models.js');

const GifEncoder = require('gif-encoder');
const Sequelize = require('sequelize');
const discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
const canvas = require('canvas');
const qr = require('qrcode');
const fs = require('fs');

const client = new discord.Client();

client.coolDowns = new discord.Collection();
client.commands = new discord.Collection();
client.events = new discord.Collection();

client.GifEncoder = GifEncoder;
client.Sequelize = Sequelize;
client.discord = discord;
client.moment = moment;
client.canvas = canvas;
client.fetch = fetch;
client.qr = qr;
client.fs = fs;

client.functions = functions;
client.models = models;
client.config = config;

client.loadEvents = function loadEvents () {
  fs.readdirSync('./events/').forEach(event => {
    delete require.cache[require.resolve(`./events/${event}`)];

    const eventName = event.split('.')[0];
    const eventFile = require(`./events/${event}`);

    client.events.set(eventName, eventFile);

    client.on(eventName, eventFile.bind(null, client));
  });
};

client.loadCommands = function loadCommands () {
  fs.readdirSync('./commands/').forEach(command => {
    delete require.cache[require.resolve(`./commands/${command}`)];

    const commandName = command.split('.')[0];
    const commandFile = require(`./commands/${command}`);

    client.commands.set(commandName, commandFile);
  });
};

client.loadEvents();
client.loadCommands();

console.log(`Successfully loaded ${fs.readdirSync('./events/').length} events.`);
console.log(`Successfully loaded ${fs.readdirSync('./commands/').length} commands.`);

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise);
});

client.login(token);

process.stdin.on('data', async data => {
  try {
    console.log(await eval(`(async()=>{${data.toString()}})()`));
  } catch (e) {
    console.log(e.message);
  }
}); // eslint-disable-line;