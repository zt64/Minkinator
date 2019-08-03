module.exports = {
    name: "reload",
    description: "Reloads the bot commands.",
    aliases: ["restart", "reboot"],
    usage: "<command>",
    roles: ["programmer"],
    async execute(message, args, client, commandFiles) {
        if (args[0] && !commandFiles.includes(`${args[0]}.js`)) {
            return message.channel.send(`\`${args[0]}\` is not a valid command.`)
        }

        if (args[0]) {
            try {
                delete require.cache[require.resolve(`./${args[0]}`)];
                const command = require(`./${args[0]}`);
                client.commands.delete(command.name);
                client.commands.set(command.name, command); 
                return message.channel.send(`Succesfully reloaded \`${args[0]}.js\``);
            } catch (error) {
                console.error(error);
                return message.channel.send(`Could not reload \`${args[0]}\``);
            }
        } else {
            for (const file of commandFiles) {
                try {
                    delete require.cache[require.resolve(`./${file}`)];
                    const command = require(`./${file}`);
                    client.commands.delete(command.name);
                    client.commands.set(command.name, command);
                    console.log(`Succesfully reloaded ${file}`);
                } catch (error) {
                    console.error(error);
                    return message.channel.send(`Could not reload \`${file}\``);
                }
            }
            message.channel.send(`Succesfully reloaded ${commandFiles.length} commands.`)
        }
    }
}