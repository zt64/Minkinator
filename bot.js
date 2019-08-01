const fs = require("fs");
const Discord = require("discord.js");
const Keyv = require('keyv');
const KeyvFile = require('keyv-file');
const {prefix, token} = require("./config.json");

const cooldowns = new Discord.Collection();
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const keyv = new Keyv({
	store: new KeyvFile({
		filename: "./temp.json",
		expiredCheckDelay: 24 * 3600 * 1000,
		writeDelay: 100,
		encode: JSON.stringify,
		decode: JSON.parse
	})
})
 
keyv.on("error", err => console.error("Keyv connection error:", err));

client.on("ready", () => {
	console.log("Ready");
});

client.on("message", async message => {
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
			return message.reply(`The proper usage for \`${prefix}${command.name} is ${command.usage}\``);
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
		command.execute(message, args, keyv);
	} catch (error) {
		console.error(error);
		message.reply("An error has occured running that command.");
	}
});

client.login(token);