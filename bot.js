const { token } = require('./token.json');
const config = require('./config.json');
const models = require('./models.js');

const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const canvas = require('canvas');
const fs = require('fs');

const client = new Discord.Client();

client.cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

client.snekfetch = snekfetch;
client.discord = Discord;
client.canvas = canvas;
client.fs = fs;

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

console.log(`Succesfully loaded ${fs.readdirSync('./events/').length} events.`);
console.log(`Succesfully loaded ${fs.readdirSync('./commands/').length} commands.`);

client.login(token);

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
