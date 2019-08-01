module.exports = {
	name: "guess",
	description: "Guess a number",
	usage: "[number]",
	args: true,
	execute(message, args, keyv) {
		val = Math.random() * (max - min) + min;
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