module.exports = {
    name: "addtag",
    description: "Adds a tag to the SQL database.",
    aliases: ["add"],
    usage: "[tag] [value]",
    async execute(message, args, tags) {
		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await tags.create({
				name: args[0],
				description: args[1],
				username: message.author.username,
			});
			return message.reply(`Tag ${tag.name} added.`);
		}
		catch (e) {
			if (e.name === 'SequelizeUniqueConstraintError') return message.reply('That tag already exists.');
			return message.reply('Something went wrong with adding a tag.');
		}
    }
}