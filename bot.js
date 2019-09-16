const { token } = require('./token.json');
const config = require('./config.json');
const models = require('./models.js');

const Discord = require('discord.js');
const canvas = require('canvas');
const brain = require('brain.js');
const fs = require('fs');

const client = new Discord.Client();
const net = new brain.recurrent.LSTM();

const eventFiles = fs.readdirSync('./events/');
const commandFiles = fs.readdirSync('./commands/');

client.events = new Discord.Collection();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

client.discord = Discord;
client.net = net;
client.fs = fs;

client.models = models;
client.config = config;
client.canvas = canvas;

client.loadEvents = function loadEvents () {
  eventFiles.forEach(event => {
    delete require.cache[require.resolve(`./events/${event}`)];

    const eventName = event.split('.')[0];
    const eventFile = require(`./events/${event}`);

    client.events.set(eventName, eventFile);

    client.on(eventName, eventFile.bind(null, client));
  });
};

client.loadCommands = function loadCommands () {
  commandFiles.forEach(command => {
    delete require.cache[require.resolve(`./commands/${command}`)];

    const commandName = command.split('.')[0];
    const commandFile = require(`./commands/${command}`);

    client.commands.set(commandName, commandFile);
  });
};

client.loadEvents();
client.loadCommands();

console.log(`Succesfully loaded ${eventFiles.length} events.`);
console.log(`Succesfully loaded ${commandFiles.length} commands.`);

client.login(token);

process.on('unhandledRejection', (code) => {
  console.log(code);
});
