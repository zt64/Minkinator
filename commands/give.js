const { users } = require("../models.js");
const { currency } = require("../config.json");

module.exports = {
    name: "give",
    description: "Gives money to another user.",
    aliases: ["send"],
    usage: "[user] [amount]",
    args: true,
    async execute(message, args) {
        if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid user.`);
        const target = await users.findOne({ where: { id: message.mentions.members.first().id }});
        const user = await users.findOne({ where: { id: message.author.id} });

        if (user.balance - args[1] >= 0 && !isNaN(args[1])) {
            await user.update({ balance: user.balance - args[1]});
            await target.update({ balance: target.balance + args[1]});
            message.channel.send(`${message.author} has sent ${currency}${args[1]} to ${args[0]}`);
        }
    }
}