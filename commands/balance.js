const { keyv } = require("../keyv.js");

module.exports = {
    name: "balance",
    description: "Checks your balance",
    aliases: ["bal"],
    usage: "<user>",
    async execute(message, args) {
        user =  message.mentions.members.first() || message.author.id;
        balance = await keyv.get(user);

        if (isNaN(balance)) {
            keyv.set(user, 0);
            balance = 0;
        }

        message.channel.send(`${user.name} has a balance of ${balance}.`);
    }
}