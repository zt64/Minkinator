const { keyv } = require("../keyv.js");

module.exports = {
	name: "guess",
	description: "Guess a number.",
	usage: "[number]",
	args: true,
	async execute(message, args) {
		val = Math.floor(Math.random() * 101);
		earn = Math.floor(Math.abs(val + args[0]) / 15)
		id = message.author.id;

		message.reply(`The number was ${val}, you earned ҵ${earn}.`);

		if (await keyv.get(id)) { 
			keyv.set(id, parseInt(await keyv.get(id)) + earn)
		} else {
			keyv.set(id, earn);
		}
	}
}