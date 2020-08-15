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
          name: "instance",
          type: String
        }
      ],
      async execute (client, message, args) {
        const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
        const defaultColor = guildConfig.colors.default;

        const modelDataEmbed = new client.Discord.MessageEmbed();
        const objectDataEmbed = new client.Discord.MessageEmbed();

        const modelName = args[0];
        const objectName = args[1];

        const model = client.database[modelName];
        if (!model) return message.channel.send(`Model \`${modelName}\` does not exist.`);

        // If no object provided, show all objects
        if (!objectName) {
          const primaryKey = model.primaryKeyAttributes[0];

          modelDataEmbed.setTitle(`${modelName}`);
          modelDataEmbed.setColor(defaultColor);

          const instances = await model.findAll();
          instances.map(object => modelDataEmbed.addField(object[primaryKey], "\u200b", true));

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
        objectDataEmbed.setColor(defaultColor);

        for (const [key, value] of Object.entries(object.dataValues)) {
          objectDataEmbed.addField(`${key}:`, JSON.stringify(value, null, 2), true);
        }

        // Send embed
        return message.channel.send(objectDataEmbed);
      }
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
          name: "instance",
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
      ],
      async execute (client, message, args) {
        const modelName = args[0];
        const objectName = args[1];
        const propertyName = args[2];

        // Check if model exists
        try {
          var model = client.database.sequelize[modelName];
        } catch (e) {
          return message.channel.send(`Model \`${modelName}\` does not exist.`);
        }

        // Check if object exists
        try {
          var object = await model.findByPk(objectName);
        } catch (e) {
          return message.channel.send(`Object \`${objectName}\` does not exist.`);
        }

        // Check if property exists
        try {
          await object.update({ [propertyName]: JSON.parse(args.slice(3).join(" ")) });
          
          return message.channel.send(`Set ${modelName}: ${objectName}.${propertyName} to \`${args.slice(3).join(" ")}\`.`);
        } catch (e) {
          return message.channel.send(`Property \`${propertyName}\` does not exist.`);
        }
      }
    },
    {
      name: "info",
      description: "Shows information about the database.",
      async execute (client, message) {
        const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
        const defaultColor = guildConfig.colors.default;

        // Create embed
        const infoEmbed = new client.Discord.MessageEmbed()
          .setColor(defaultColor)
          .setTitle("Database Information")
          .addField("Sequelize Version:", "placeholder")
          .addField("Sqlite3 Version:", "placeholder")
          .addField("Database Size:", "placeholder");

        return message.channel.send(infoEmbed);
      }
    }
  ]
};
