const { prefix } = require("./config.json");
const { token } = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");
const cooldowns = new Discord.Collection();
const client = new Discord.Client();
let counter = 0;
let lastMessage = "";

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on("ready", () => {
	console.log("Ready");
});

client.on("message", async message => {
	if (message.content == lastMessage && message.author.id !== "602293577594437652") {
		counter += 1;
		if (counter == 3) {
			counter = 0;
			message.channel.send(message.content);
		}
	}

	lastMessage = message.content;

	if (!message.content.startsWith(prefix) || message.author.bot) return;
	
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	
	if (!command) return;
	
	if(command.guildOnly && message.channel.type !== "text") {
		return message.reply("This command cannot be ran inside DMs");
	}
	
	if(command.args && !args.length) {
		if (command.usage) {
			return message.reply(`The proper usage for that command is \`${prefix}${command.name}${command.usage}\``);
		} else {
			return message.reply("You didn't provide any arguments.");
		}
	}
	
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing ${command.name}.`);
		}
	}
	
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply("An error has occured running that command.");
	}
});

client.login(token);