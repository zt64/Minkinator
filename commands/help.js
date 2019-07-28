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
	}
}