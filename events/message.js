let counter = 1;
let lastMessage = "";

module.exports = async(client, message,) => {
	if (message.author.bot) return;
	user = await client.models.users.findByPk(message.author.id);

	xpTotal = user.level + user.xp;
	xpRequired = Math.pow(2, user.level);
	
	user.update({ xp: xpTotal, messages: user.messages + 1});
	
	if (xpTotal >= xpRequired) {
		user.update({ level: user.level + 1})
        message.reply(`You leveled up to level ${user.level}!`);
        
        if (user.level % 5 == 0) {
            user.update({ balance: user.balance + 500})
        }
	}
	
	if (message.content == lastMessage) {
		counter += 1;
		if (counter == 3) {
			counter = 0;
			message.channel.send(message.content);
		}
	}

	lastMessage = message.content;

	if (!message.content.startsWith(client.config.prefix)) return;
	
	const args = message.content.slice(client.config.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	
	if (!command) return;
	
	if (message.channel.type !== "text") return message.reply("Commands cannot be run inside DMs.");
	if (command.ownerOnly && !message.author.id == ownerID) return message.reply("You are not the bot owner.");
	if (command.roles && !message.member.roles.some(role => command.roles.includes(role.name))) return message.reply(`You are missing one of the required roles: ${command.roles.join(", ")}.`);
	if (command.args && !args.length) return message.reply(`The proper usage for that command is \`${client.config.prefix}${commandName} ${command.usage}\``);
	if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new client.discord.Collection());
	
	if (message.author.id !== client.config.ownerID) {
		const now = Date.now();
		const timestamps = client.cooldowns.get(command.name);
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
		command.execute(client, message, args);
	} catch (error) {
		console.error(error);
		return message.reply("An error has occured running that command.");
    }
}