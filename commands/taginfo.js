module.exports = {
    name: "taginfo",
    description: "Returns a tags info.",
    async execute(message, args, tags) {
		// equivalent to: SELECT * FROM tags WHERE name = 'args[0' LIMIT 1;
		const tag = await tags.findOne({ where: { name: args[0]} });
		if (tag) {
			return message.channel.send(`${args[0]} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
		}
		return message.reply(`Could not find tag: ${args[0]}`);
    }
}