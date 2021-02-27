const pluralize = require("pluralize");

module.exports = {
  description: "View available commands and their information.",
  aliases: ["commands"],
  parameters: [
    {
      name: "command name",
      type: String
    }
  ],
  async execute (client, message, [ commandName ]) {
    const { prefix, colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    const owner = await client.users.fetch(global.config.ownerID);
    const helpEmbed = new Discord.MessageEmbed({
      color: colors.default,
      footer: { iconURL: owner.displayAvatarURL(), text: `Created by Litleck (${owner.tag})` }
    });

    if (commandName) {
      const command = client.commands.find(command => command.name === commandName) || [...client.commands.values()].find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

      if (!command || (command.permissions && !message.member.hasPermission(command.permissions))) {
        return message.reply(new Discord.MessageEmbed({
          color: colors.default,
          title: "Invalid Command",
          description: `\`${commandName}\` is not a valid command.`
        }));
      }

      helpEmbed.addFields([
        { name: "Command:", value: command.name, inline: true },
        { name: "Category:", value: command.category, inline: true },
        { name: "Description:", value: command.description },
        { name: "Cool down:", value: pluralize("second", command.coolDown || 3, true), inline: true },
        { name: "Permissions:", value: command.permissions ? command.permissions.join(", ") : "Everyone", inline: true }
      ]);

      if (command.aliases) helpEmbed.addField("Aliases:", command.aliases.join(", "), true);

      if (command.parameters) {
        const array = command.parameters.map(parameter => parameter.required ? `[${parameter.name}]` : `<${parameter.name}>`);

        helpEmbed.addField("Proper usage:", `\`${prefix}${commandName} ${array.join(" ")}\``);
      }

      return message.reply(helpEmbed);
    }

    helpEmbed.setTitle("🏠 Home Page");
    helpEmbed.setDescription(`There is a total of 6 command categories. For information on a specific command, run: \`${prefix}help <command>\``);
    helpEmbed.addFields([
      { name: "🥳 Fun", value: "Fun commands to play around with." },
      { name: "💵 Economy ", value: "Buy, sell, and make a profit." },
      { name: "👤 Member", value: "Member related commands." },
      { name: "🖌️ Image", value: "Manipulate an image as you desire." },
      { name: "🛠️ Utility", value: "Variety of commands with their own uses." },
      { name: "🔒 Moderation", value: "Commands to manage a server." }
    ]);

    const helpMessage = await message.reply(helpEmbed);

    const categories = {
      "🥳": "fun",
      "💵": "economy",
      "👤": "member",
      "🖌️": "image",
      "🛠️": "utility",
      "🔒": "moderation"
    };

    Object.keys(categories).forEach(async reaction => await helpMessage.react(reaction));

    // Create reaction collector
    const collector = helpMessage.createReactionCollector((reaction, user) => Object.keys(categories).includes(reaction.emoji.name) && user.id === message.author.id);

    collector.on("collect", async reaction => {
      const emoji = reaction.emoji.name;
      const category = categories[emoji];

      helpEmbed.setTitle(`${emoji} ${util.capitalize(category)} Commands`);
      helpEmbed.setDescription(`For more information on a certain command you can type \`${prefix}help <command name>\``);

      helpEmbed.fields = [];

      client.commands.forEach(command => {
        if (command.category !== category) return;

        let title = `${prefix}${command.name}`;

        if (command.parameters) {
          const parameters = command.parameters.map(parameter => parameter.required ? `[${parameter.name}]` : `<${parameter.name}>`);
          title += ` ${parameters.join(" ")}`;
        }

        helpEmbed.addField(`\`${title}\``, command.description || "\u200b");
      });

      helpMessage.reactions.resolve(emoji).users.remove(message.author);

      await helpMessage.edit(helpEmbed);
    });
  }
};