const {prefix} = require("../config.json");

module.exports = {
	name: "help",
	description: "Displays command information.",
	usage: "[command name]",
	aliases: ["commands"],
	execute(message, args) {
		const data = [];
		const {commands} = message.client;
		
		if (!args.length) {
			data.push("You have summoned I, the Minkinator");
			data.push(commands.map(command => command.name).join(", "));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command.`);
			
			return message.channel.send(data, {split: true});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply("That's not a valid command.");
		}

		data.push(`Name: ${command.name}`);

		if (command.aliases) data.push(`Aliases: ${command.aliases.join(",")}`);
		if (command.description) data.push(`Description: ${command.description}`);
		if (command.usage) data.push(`Usage: ${command.usgae}`);
		
		data.push(`Cooldown: ${command.cooldown || 3} second(s)`);

		message.channel.send(data, {split: true});
	}
}