const { keyv } = require("../keyv.js");
const { currency } = require("../config.json");

module.exports = {
    name: "give",
    description: "Gives money to another user.",
    aliases: ["send"],
    usage: "[user] [amount]",
    args: true,
    async execute(message, args) {
        user = message.mentions.users.first();

        if (!(user && message.guild.members.has(user.id))) {
            return message.channel.send(`The user ${args[0]} does not exist.`);
        }

        userBal = await keyv.get(user.id);
        balance = await keyv.get(message.author.id);
        amount = parseInt(args[1]);

        if (balance - amount >= 0 && !isNaN(amount)) {
            keyv.set(message.author.id, balance - amount);
            keyv.set(user.id, userBal + amount);
            message.channel.send(`${message.author} has sent ${currency}${amount} to ${user}.`);
        } else {
            message.reply(`You are missing the additional ${currency}${Math.abs(amount - balance)}.`);
        }
    }
}