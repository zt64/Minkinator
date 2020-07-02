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
    const properties = client.database.properties;

    const guildConfigDB = await properties.findByPk("configuration");
    const guildConfig = guildConfigDB.value;
    const successColor = guildConfig.colors.success;

    const key = args[0];

    const configEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle("Guild Configuration");

    if (!key) {
      for (const [key, value] of Object.entries(guildConfig)) {
        configEmbed.addField(`${key}:`, `\`\`\`json\n${JSON.stringify(value, null, 2)}\`\`\``, true);
      }

      return message.channel.send(configEmbed);
    }

    if (!(key in guildConfig)) return message.channel.send(`\`${key}\` is not a guild property.`);

    if (typeof (guildConfig[key]) === "object") {
      const object = guildConfig[key];
      const objectKey = args[1];
      const value = args[2];

      if (!(objectKey in object)) return message.channel.send(`\`${objectKey}\` does not exist in ${key}`);
      if (!value) return message.channel.send(`No value specified for: \`${key}\`.`);

      try {
        guildConfig[key][objectKey] = JSON.parse(value);
      } catch (error) {
        return message.channel.send(`Unable to parse \`${value}\` for \`${objectKey}\`.`);
      }

      configEmbed.setDescription(`Successfully set \`${key}.${objectKey}\` to \`${value}\`.`);
    } else {
      const value = args[1];

      if (!value) return message.channel.send(`No value specified for: \`${key}\`.`);

      try {
        guildConfig[key] = JSON.parse(value);
      } catch (error) {
        return message.channel.send(`Unable to parse \`${value}\` for \`${key}\`.`);
      }

      configEmbed.setDescription(`Successfully set \`${key}\` to \`${value}\`.`);
    }

    guildConfigDB.update({ value: guildConfig });

    return message.channel.send(configEmbed);
  }
};