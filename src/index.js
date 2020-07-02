const functions = require("./lib/functions.js");
const config = require("./config/config.json");
const tokens = require("./config/tokens.json");
const models = require("./lib/models.js");

const Markov = require("markov-strings").default;
const GifEncoder = require("gif-encoder");
const Sequelize = require("sequelize");
const pluralize = require("pluralize");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");
const canvas = require("canvas");
const colors = require("colors");
const pms = require("pretty-ms");
const qr = require("qrcode");
const fs = require("fs");

const client = new Discord.Client(config.clientOptions);

const time = moment().format("HH:mm M/D/Y");

client.coolDowns = new Discord.Collection();
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

client.GifEncoder = GifEncoder;
client.Sequelize = Sequelize;
client.pluralize = pluralize;
client.Discord = Discord;
client.Markov = Markov;
client.moment = moment;
client.canvas = canvas;
client.colors = colors;
client.fetch = fetch;
client.pms = pms;
client.qr = qr;
client.fs = fs;

client.functions = functions;
client.databases = models;
client.config = config;
client.tokens = tokens;

client.loadEvents = function loadEvents () {
  fs.readdirSync("./events/").forEach(async eventName => {
    delete require.cache[require.resolve(`./events/${eventName}`)];

    const eventFile = require(`./events/${eventName}`);

    eventName = eventName.replace(".js", "");

    client.events.set(eventName, eventFile);

    client.on(eventName, eventFile.bind(null, client));
  });
  console.log(`${`(${time})`.green} Successfully loaded ${client.events.size} events.`);
};

client.loadCommands = function loadCommands () {
  fs.readdirSync("./commands/").forEach(category => {
    fs.readdirSync(`./commands/${category}`).forEach(async commandName => {
      delete require.cache[require.resolve(`./commands/${category}/${commandName}`)];

      const commandFile = require(`./commands/${category}/${commandName}`);

      commandName = commandName.replace(".js", "");

      client.commands.set(commandName, commandFile);

      const command = client.commands.get(commandName);

      command.name = commandName;
      command.category = category;

      if (category === "owner") command.ownerOnly = true;
    });
  });
  console.log(`${`(${time})`.green} Successfully loaded ${client.commands.size} commands.`);
};

client.loadEvents();
client.loadCommands();

client.login(tokens.token);

process.on("unhandledRejection", error => console.error("Unhandled Promise Rejection at:", error));

process.stdin.on("data", async data => {
  try {
    console.log(await eval(`(async()=>{${data.toString()}})()`));
  } catch (error) {
    console.error(error.message);
  }
});