const { sequelize } = require("../models.js");

module.exports = {
    name: "get",
    description: "Gets a value from a database.",
    usage: "[model] <key> <property>",
    args: true,
    async execute(client, message, args) {
        try {
            model = sequelize.model(args[0]);
        } catch(e) {
            return message.channel.send(`Model: ${args[0]}, does not exist.`);
        }
        
        if (!args[1]) {
            return message.channel.send(await model.findAll().map(x => x.id));
        }

        try {
            object = await model.findByPk(args[1]);
        } catch(e) {
            return message.channel.send(`Object: ${args[1]}, does not exist.`);
        }

        for (let [key, value] of (Object.entries(object.dataValues))) {
            message.channel.send(`${key}: ${JSON.stringify(value)}`);
        }
    }
}