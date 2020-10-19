module.exports = {
  description: "Change guild settings.",
  permissions: ["ADMINISTRATOR"],
  aliases: ["gc"],
  parameters: [
    {
      name: "key",
      type: String
    },
    {
      name: "value | key"
    },
    {
      name: "value"
    }
  ],
  async execute (client, message, args) {
    const guildInstance = global.guildInstance;
    const config = await guildInstance.config;
    const defaultColor = config.dataValues.colors.default;

    const key = args[0];

    // Create embed
    const configEmbed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Guild Configuration");

    if (!key) {
      configEmbed.setDescription(`\`\`\`json\n${JSON.stringify(config.dataValues, null, 2)}\`\`\``);

      return message.channel.send(configEmbed);
    }

    // Make sure property exists
    if (!(key in config.dataValues)) return message.channel.send(`\`${key}\` is not a guild property.`);

    if (typeof (config.dataValues[key]) === "object") {
      const object = config.dataValues[key];
      const objectKey = args[1];
      const value = args[2];

      if (!(objectKey in object)) return message.channel.send(`\`${objectKey}\` does not exist in ${key}`);
      if (!value) return message.channel.send(`No value specified for: \`${key}\`.`);

      try {
        config.dataValues[key][objectKey] = JSON.parse(value);
      } catch (error) {
        return message.channel.send(`Unable to parse \`${value}\` for \`${objectKey}\`.`);
      }

      configEmbed.setDescription(`Successfully set \`${key}.${objectKey}\` to \`${value}\`.`);
    } else {
      const value = args[1];

      if (!value) return message.channel.send(`No value specified for: \`${key}\`.`);

      try {
        config.dataValues[key] = JSON.parse(value);
      } catch (error) {
        return message.channel.send(`Unable to parse \`${value}\` for \`${key}\`.`);
      }

      configEmbed.setDescription(`Successfully set \`${key}\` to \`${value}\`.`);
    }

    await guildInstance.setConfig(config);

    return message.channel.send(configEmbed);
  }
};