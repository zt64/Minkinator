const config = global.config = require("./config/config.json");
const auth = global.auth = require("./config/auth.json");
const Discord = global.Discord = require("discord.js");
const moment = global.moment = require("moment");
const chalk = global.chalk = require("chalk");
const fs = global.fs = require("fs");

const client = global.client = new Discord.Client(config.clientOptions);
const time = moment().format("HH:mm M/D/Y");

global.markov = require("purpl-markov-chain");
global.util = require("./util/functions.js");
global.pluralize = require("pluralize");
global.fetch = require("node-fetch");
global.canvas = require("canvas");

// Set client properties
client.database = require("./models/");
client.coolDowns = new Map();

// Set up event handler
client.loadEvents = async () => {
  client.events = [];

  fs.readdirSync("./events/").forEach(eventName => {
    delete require.cache[require.resolve(`./events/${eventName}`)];

    const event = require(`./events/${eventName}`);

    client.events.push(event);

    client.on(eventName.replace(".js", ""), event.bind(null, client));
  });

  console.log(chalk.green(`(${time})`), `Successfully loaded ${client.events.length} events.`);
};

// Set up command handler
client.loadCommands = async () => {
  client.commands = [];

  fs.readdirSync("./commands/").forEach(category => {
    fs.readdirSync(`./commands/${category}`).forEach(commandName => {
      delete require.cache[require.resolve(`./commands/${category}/${commandName}`)];

      let command;

      try {
        command = require(`./commands/${category}/${commandName}`);
      } catch (error) {
        console.log(chalk.green(`(${time})`), `Failed to load ${commandName}, skipping.`);
        return console.error(error);
      }

      if (category === "owner") command.ownerOnly = true;

      command.name = commandName.replace(".js", "");
      command.category = category;

      client.commands.push(command);
    });
  });

  console.log(chalk.green(`(${time})`), `Successfully loaded ${client.commands.length} commands.`);
};

// Load events and commands
client.loadEvents();
client.loadCommands();

// Login to Discord API
if (!auth.discord) return console.error("No token provided, enter a token in to the auth file to login.");
client.login(auth.discord);

// Handle promise rejections
process.on("unhandledRejection", error => console.error(error));

// Take input from stdin
process.stdin.on("data", async data => {
  try {
    console.log(await eval(`(async()=>{${data.toString()}})()`));
  } catch (error) {
    console.error(error.message);
  }
});

process.on("SIGINT", function() {
  client.destroy();
  process.exit();
});