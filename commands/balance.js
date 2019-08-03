const { keyv } = require("../keyv.js");
const { currency } = require("../config.json");

module.exports = {
    name: "balance",
    description: "Checks your balance.",
    aliases: ["bal"],
    usage: "<user>",
    async execute(message, args) {
        if (args[0]) {
            user = message.mentions.users.first();
        } else {
            user = message.author;
        }

        if (await keyv.get(user.id)) {
            balance = await keyv.get(user.id);
        } else {
            balance = 0;
        }

        message.channel.send(`${user} has a balance of ${currency}${balance}.`);
    }
}