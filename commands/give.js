const { keyv } = require("../keyv.js");

module.exports = {
    name: "give",
    description: "Gives money to another user.",
    aliases: ["send"],
    usage: "[user] [amount]",
    async execute(message, args) {
        user = message.mentions.users.first();
        userBal = parseInt(await keyv.get(user.id));
        balance = await keyv.get(message.author.id);
        amount = parseInt(args[1]);

        if (balance - amount >= 0 && amount !== 0) {
            keyv.set(message.author.id, balance - amount);
            keyv.set(user.id, userBal + amount);
            message.channel.send(`${message.author} has sent ${amount} to ${user}`);
        } else {
            message.reply(`You are missing the additional ${Math.abs(amount - balance)}.`);
        }
    }
}