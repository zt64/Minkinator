const { prefix, ownerID} = require("./config.json");
const { token } = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");

const cooldowns = new Discord.Collection();
const client = new Discord.Client();

let counter = 0;
let lastMessage = "";

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

client.commands = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on("ready", () => {
	console.log(`Minkinator is now online.`);
	client.user.setPresence({
        game: { 
            name: 'over you.',
            type: 'watching'
        },
        status: 'idle'
    })
});

client.on("message", async message => {
	if (message.content == lastMessage && message.author.id !== message.author.bot) {
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
	
	if(message.channel.type !== "text") {
		return message.reply("Commands cannot be run inside DMs.");
	}

	if (command.adminOnly && !message.member.hasPermission("ADMINISTRATOR")) {
		return message.reply("You are not an administrator.")
	} else if (command.ownerOnly && message.author.id !== ownerID) {
		return message.reply("You are not the bot owner.");
	}
	
	if(command.args && !args.length) {
		if (command.usage) {
			return message.reply(`The proper usage for that command is \`${prefix}${commandName} ${command.usage}\``);
		} else {
			return message.reply("You didn't provide any arguments.");
		}
	}
	
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	if (message.author.id !== ownerID) {
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
	}

	try {
		command.execute(message, args, client, commandFiles);
	} catch (error) {
		console.error(error);
		message.reply("An error has occured running that command.");
	}
});

client.login(token);