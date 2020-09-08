/* eslint-disable no-eval */
module.exports = {
  description: "Evaluates Javascript code.",
  aliases: ["evaluate"],
  parameters: [
    {
      name: "input",
      required: true
    }
  ],
  async execute (client, message, args) {
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;

    // Attempt to run code
    try {
      return message.channel.send(new global.Discord.MessageEmbed()
        .setColor(defaultColor)
        .setTitle("JS Result")
        .setDescription(`\`\`\`js\n${await eval(`(async() => {${args.join(" ")}})()`)}\`\`\``)
      );
    } catch (error) {
      return message.channel.send(new global.Discord.MessageEmbed()
        .setColor(defaultColor)
        .setTitle("JS Error")
        .setDescription(`\`\`\`js\n${error}\`\`\``)
      );
    }
  }
};