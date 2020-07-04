module.exports = {
  description: "Set or get database properties.",
  aliases: ["db"],
  subCommands: [
    {
      name: "get",
      description: "Get a guild property.",
      parameters: [
        {
          name: "model",
          type: String,
          required: true
        },
        {
          name: "object",
          type: String
        }
      ]
    },
    {
      name: "set",
      description: "Set a guild property.",
      parameters: [
        {
          name: "model",
          type: String,
          required: true
        },
        {
          name: "object",
          required: true
        },
        {
          name: "property",
          type: String,
          required: true
        },
        {
          name: "value"
        }
      ]
    }
  ],
  parameters: [
    {
      name: "get | set",
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const subCommand = args[0];

    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;

    const modelName = args[1];
    const objectName = args[2];

    // Check if model exists

    try {
      var model = client.database.sequelize.model("members");
      console.log(model);
    } catch (e) {
      return message.channel.send(`Model \`${modelName}\` does not exist.`);
    }

    if (subCommand === "get") {
      const modelDataEmbed = new client.Discord.MessageEmbed();
      const objectDataEmbed = new client.Discord.MessageEmbed();

      const page = 1;

      // If no object provided, show all objects

      if (!args[1]) {
        const primaryKey = model.primaryKeyAttributes[0];

        modelDataEmbed.setTitle(`${modelName}`);
        modelDataEmbed.setColor(successColor);

        await model.findAll().map(object => modelDataEmbed.addField(object[primaryKey], "\u200b", true));

        return message.channel.send(modelDataEmbed);
      }

      // Check if object exists

      try {
        var object = await model.findByPk(objectName);
      } catch (e) {
        return message.channel.send(`Object: ${objectName}, does not exist.`);
      }

      // Set embed properties

      objectDataEmbed.setTitle(`${modelName}: ${objectName}`);
      objectDataEmbed.setColor(successColor);

      for (const [key, value] of Object.entries(object.dataValues)) {
        objectDataEmbed.addField(`${key}:`, JSON.stringify(value, null, 2), true);
      }

      // Send embed

      return message.channel.send(objectDataEmbed);
    }

    if (subCommand === "set") {
      const propertyName = args[3];

      try {
        var object = await model.findByPk(objectName);
      } catch (e) {
        return message.channel.send(`Object \`${objectName}\` does not exist.`);
      }

      try {
        await object.update({ [propertyName]: JSON.parse(args.slice(4).join(" ")) });
        return message.channel.send(`Set ${modelName}: ${objectName}.${propertyName} to \`${args.slice(4).join(" ")}\`.`);
      } catch (e) {
        return message.channel.send(`Property \`${propertyName}\` does not exist.`);
      }
    }
  }
};
