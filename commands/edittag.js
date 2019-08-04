module.exports = {
    name: "edittag",
    description: "Edits a tag.",
    usage: "[tag] [value]",
    async execute(message, args) {
		// equivalent to: UPDATE tags (descrption) values (?) WHERE name='?';
		const affectedRows = await Tags.update({ description: args[1] }, { where: { name: args[0] } });
		if (affectedRows > 0) {
			return message.reply(`Tag ${args[0]} was edited.`);
		}
		return message.reply(`Could not find a tag with name ${args[0]}.`);
    }
}