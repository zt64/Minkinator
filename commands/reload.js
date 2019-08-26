module.exports = {
    name: "reload",
    description: "Reloads the bot commands.",
    aliases: ["restart", "reboot"],
    usage: "<command>",
    roles: ["Programmer"],
    async execute(client, message, args) {
        if(!args || args.length < 1) return message.reply("Must provide a command name to reload.");

        const commandName = args[0];

        if(!client.commands.has(commandName)) {
            return message.reply("That command does not exist");
        }

        delete require.cache[require.resolve(`./${commandName}.js`)];

        const props = require(`./${commandName}.js`);

        client.commands.delete(commandName);
        client.commands.set(commandName, props);
        message.reply(`The command ${commandName} has been reloaded`);
    }
}