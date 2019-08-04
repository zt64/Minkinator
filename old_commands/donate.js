const { keyv } = require("../keyv.js");
const { currency } = require("../config.json");

module.exports = {
    name: "donate",
    description: "Donate to the mink project.",
    usage: "[amount]",
    args: true,
    async execute(message, args) {
        balance = await keyv.get(message.author.id);
        project = parseInt(await keyv.get("minkProject"));
        amount = parseInt(args[0]);

        if (balance - amount >= 0 && amount !== 0) {
            keyv.set(message.author.id, balance - amount);
            keyv.set("minkProject", project + amount);
            message.reply(`Thank you for donating ${currency}${amount} to the mink project. \nThe mink project now stands at a balance of ${currency}${project + amount}.`);
        } else {
            message.reply(`You are missing the additional ${currency}${Math.abs(amount - balance)}.`);
        }
    }
}