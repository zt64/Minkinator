const { keyv } = require("../keyv.js");

module.exports = {
    name: "set",
    description: "Sets a variable",
    usage: "[key] [value]",
    ownerOnly: true,
    args: true,
    execute(message, args) {
        keyv.set(args[0], args[1]);
        message.channel.send(`${args[0]} has been set to ${args[1]}`);
    }
}