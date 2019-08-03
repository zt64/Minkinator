const { keyv } = require("../keyv.js");

module.exports = {
	name: "guess",
	description: "Guess a number.",
	usage: "[number]",
	args: true,
	cooldown: 0,
	async execute(message, args) {
		val = Math.floor(Math.random() * 101);
		id = message.author.id;

		if (val == args[0]) {
			earn = 1000;
		} else {
			earn = Math.round(50 / Math.abs(val - args[0]) * 4);
		}

		if (await keyv.get(id)) { 
			keyv.set(id, parseInt(await keyv.get(id)) + earn)
		} else {
			keyv.set(id, earn);
		}

		message.reply(`The number was ${val}, you earned ҵ${earn}.`);
	}
}