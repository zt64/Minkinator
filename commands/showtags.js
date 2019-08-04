module.exports = {
    name: "showtags",
    description: "Shows all tags.",
    async execute(message, args, tags) {
        // equivalent to: SELECT name FROM tags;
		const tagList = await tags.findAll({ attributes: ['name'] });
		const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
		return message.channel.send(`List of tags: ${tagString}`);
    }
}