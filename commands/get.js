const { keyv } = require("../keyv.js");

module.exports = {
    name: "get",
    description: "Returns a variable",
    usage: "[key]",
    ownerOnly: true,
    args: true,
    async execute(message, args) {
        value = await keyv.get(args[0]);
        message.channel.send(`${args[0]} is ${value}.`);
    }
}