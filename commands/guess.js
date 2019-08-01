const { keyv } = require("../keyv.js");

module.exports = {
	name: "guess",
	description: "Guess a number",
	usage: "[number]",
	args: true,
	async execute(message, args) {
		val = Math.random() * (0 - 100) + 0;
		earn = Math.abs(args[0] - val) * 0.1;
		id = message.author.id;
		message.reply(`The number was ${val}, you earned ${earn}.`);

		if (!await keyv.get(id)) { 
			keyv.set(id, earn)
		} else {
			keyv.set(id, await keyv.get(id) + earn)
		}
	}
}