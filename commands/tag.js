module.exports = {
    name: "tag",
    description: "Gets the value of a tag.",
    usage: ["[tag]"],
    async execute(message, args, tags) {
		// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
		const tag = await tags.findOne({ where: { name: args[0] } });
		if (tag) {
			// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
			tag.increment('usage_count');
			return message.channel.send(tag.get('description'));
		}
		return message.reply(`Could not find tag: ${tagName}`);
    }
}