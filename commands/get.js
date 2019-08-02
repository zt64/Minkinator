const { keyv } = require("../keyv.js");

module.exports = {
    name: "get",
    description: "Returns a variable",
    usage: "[key]",
    args: true,
    async execute(message, args) {
        message.channel.send(`${args[0]}: ` + await keyv.get(args[0]));
    }
}