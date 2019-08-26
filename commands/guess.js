const { users } = require("../models.js");
const { currency } = require("../config.json");

module.exports = {
	name: "guess",
	description: "Guess a number.",
	usage: "[number]",
	args: true,
	async execute(client, message, args) {
		const user = await users.findOne({ where: { id: message.author.id} });
		const input = Math.floor(args[0]);

		val = Math.round(Math.random() * 100);
		val !== input ? earn = Math.round(50 / Math.abs(val - input) * 4) : earn = 1000;

		await user.update({ balance: user.balance + earn});

		message.reply(`The number was ${val}, you earned ${currency}${earn}.`);
	}
}