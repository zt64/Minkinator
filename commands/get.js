const { sequelize } = require("../models.js");

module.exports = {
    name: "get",
    description: "Gets a value from a database.",
    usage: "[model] <object> <attribute>",
    args: true,
    async execute(message, args) {
        try {
            model = sequelize.model(args[0]);
        } catch(e) {
            return message.channel.send(`Model: ${args[0]}, does not exist.`);
        }
        
        if (!args[1]) {
            return message.channel.send("Model Objects");
        }

        try {
            object = await model.findOne({ where: { name: args[1] }});
        } catch(e) {
            return message.channel.send(`Object: ${args[1]}, does not exist.`);
        }

        for (let [key, value] of (Object.entries(object.rawAttributes))) {
            message.channel.send(`${key}: ${JSON.stringify(value)}`);
        }
    }
}