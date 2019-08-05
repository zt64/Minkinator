const { users } = require("../models.js");
const { currency } = require("../config.json");

module.exports = {
    name: "balance",
    description: "Checks your balance.",
    aliases: ["bal"],
    usage: "<user>",
    async execute(message, args) {      
        !args[0] ? target = message.author : target = message.mentions.users.first();
        
        try {
            const user = await users.findOne({ where: { id: target.id} });
            message.channel.send(`${target} has a balance of ${currency}${user.balance}.`); 
        } catch {
            message.channel.send(`${target} does not exist.`)
        }  
    }
}