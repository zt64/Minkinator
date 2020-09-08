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
        global.guildInstance.guildConfig;
        const defaultColor = guildConfig.colors.default;

        const embed = new global.Discord.MessageEmbed()
          .setColor(defaultColor);

        const modelName = args[0];
        const objectName = args[1];

        const model = client.database[modelName];
        if (!model) return message.channel.send(`Model \`${modelName}\` does not exist.`);

        // If no entity provided, show all entities
        if (!objectName) {
          embed.setTitle(`${modelName}`);

          const entities = await model.findAll();

          const array = entities.map(entity => Object.values(entity.dataValues)[0]);

          embed.setDescription(`\`\`\`json\n${JSON.stringify(array, null, 2)}\`\`\``);

          return message.channel.send(embed);
        }

        // Check if object exists
        try {
          var object = await model.findByPk(objectName);
        } catch (e) {
          return message.channel.send(`Object: ${objectName}, does not exist.`);
        }

        // Set embed properties
        embed.setTitle(`${modelName}: ${objectName}`);

        embed.setDescription(`\`\`\`json\n${JSON.stringify(object, null, 2)}\`\`\``);

        return message.channel.send(embed);
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
        global.guildInstance.guildConfig;
        const defaultColor = guildConfig.colors.default;

        const fs = global.fs;

        const dependencies = require("../../../package.json").dependencies;
        const prettyBytes = require("pretty-bytes");
        
        const sequelizeVersion = dependencies.sequelize;
        const sqlite3Version = dependencies.sqlite3;

        const stats = fs.statSync(`./data/${message.guild.id}.sqlite`);
        const size = prettyBytes(stats.size);

        // Create embed
        const embed = new global.Discord.MessageEmbed()
          .setColor(defaultColor)
          .setTitle("Database Information")
          .addField("Sequelize Version:", sequelizeVersion)
          .addField("Sqlite3 Version:", sqlite3Version)
          .addField("Database Size:", size);

        return message.channel.send(embed);
      }
    }
  ]
};
