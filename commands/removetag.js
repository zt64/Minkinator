module.exports = {
    name: "removetag",
    description: "Removes a tag.",
    usage: "[tag]",
    async execute(message, args) {
		const rowCount = await tags.destroy({ where: { name: args[0] } });
		if (!rowCount) return message.reply('That tag did not exist.');
		return message.reply('Tag deleted.');
    }
}