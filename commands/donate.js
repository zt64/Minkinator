const { users, variables } = require("../models.js");
const { currency } = require("../config.json");

module.exports = {
    name: "donate",
    description: "Donate to the mink project.",
    usage: "[amount]",
    args: true,
    async execute(message, args) {
        const user = await users.findOne({ where: { id: message.author.id} });
        const project = await variables.findOne({ where: { name: "minkProject"} });
        const amount = Math.floor(parseInt(args[0]));

        if (user.balance - amount >= 0 && amount !== 0) {
            await user.update({ balance: user.balance - amount});
            await project.update({ value: project.value + amount});
            return message.reply(`Thank you for donating ${currency}${amount} to the mink project. \nThe mink project now stands at a balance of ${currency}${project.value}.`);
        } else {
            return message.reply(`You are missing the additional ${currency}${Math.abs(amount - user.balance)}.`);
        }
    }
}