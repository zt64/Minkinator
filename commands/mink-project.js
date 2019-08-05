const { variables } = require("../models.js");
const { currency } = require("../config.json");

module.exports = {
    name: "mink-project",
    description: "Information about the mink project.",
    aliases: ["mp"],
    async execute(message) {
        balance = await variables.findOne({ where: { name: "minkProject" }});
        message.channel.send(`The mink project stands at a balance of ${currency}${balance.value}.`)
    }
}