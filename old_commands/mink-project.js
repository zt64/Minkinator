const { keyv } = require("../keyv.js");
const { currency } = require("../config.json");

module.exports = {
    name: "mink-project",
    description: "Information about the mink project.",
    async execute(message) {
        balance = await keyv.get("minkProject");
        if (isNaN(balance)) {
            balance = 0;
        }
        message.channel.send(`The mink project stands at a balance of ${currency}${balance}.`)
    }
}