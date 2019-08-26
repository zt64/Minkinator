const { token } = require("./token.json");
const models = require("./models.js");
const config  = require("./config.json");
const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

client.discord = Discord;
client.models = models;
client.config = config;

fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
	  if (!file.endsWith(".js")) return;
	  const event = require(`./events/${file}`);
	  let eventName = file.split(".")[0];
	  client.on(eventName, event.bind(null, client));
	  delete require.cache[require.resolve(`./events/${file}`)];
	});
});

fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
	  if (!file.endsWith(".js")) return;
	  let props = require(`./commands/${file}`);
	  let commandName = file.split(".")[0];
	  console.log(`Attempting to load command ${commandName}`);
	  client.commands.set(commandName, props);
	});
});

client.login(token);