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
    const { prefix, colors } = global.guildInstance.config;

    const helpEmbed = new global.Discord.MessageEmbed({
      color: colors.default,
      footer: { text: `Created by Litleck (${await client.users.fetch(global.config.ownerID).then(user => user.tag)})` }
    });

    if (commandName) {
      const command = client.commands.find(command => command.name === commandName) || [...client.commands.values()].find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

      if (!command || (command.permissions && !message.member.hasPermission(command.permissions))) {
        return message.channel.send(new global.Discord.MessageEmbed({
          color: colors.default,
          title: "Invalid Command",
          description: `\`${commandName}\` is not a valid command.`
        }));
      }

      helpEmbed.addFields([
        { name: "Command", value: command.name, inline: true },
        { name: "Category", value: command.category, inline: true },
        { name: "Description", value: command.description },
        { name: "Cool down", value: global.pluralize("second", command.coolDown || 3, true), inline: true },
        { name: "Permissions", value: command.permissions ? command.permissions.join(", ") : "Everyone", inline: true }
      ]);

      if (command.aliases) helpEmbed.addField("Aliases:", command.aliases.join(", "), true);

      if (command.parameters) {
        const array = command.parameters.map(parameter => parameter.required ? `[${parameter.name}]` : `<${parameter.name}>`);

        helpEmbed.addField("Proper usage", `\`${prefix}${commandName} ${array.join(" ")}\``);
      }

      return message.channel.send(helpEmbed);
    }

    helpEmbed.setTitle("🏠 Home Page");
    helpEmbed.setDescription(`There is a total of 6 command categories. For information on a specific command, run: \`${prefix}help <command>\``);
    helpEmbed.addFields([
      { name: "🥳 Fun", value: "Fun commands to play around with." },
      { name: "💵 Economy ", value: "Buy, sell, and make a profit." },
      { name: "👤 Member", value: "Member related commands." },
      { name: "🖌️ Canvas", value: "Manipulate an image as you desire." },
      { name: "🛠️ Utility", value: "Variety of commands with their own uses." },
      { name: "🔒 Admin", value: "Commands to manage a server." }
    ]);

    const helpMessage = await message.channel.send(helpEmbed);

    ["🥳", "💵", "👤", "🖌️", "🛠️", "🔒"].map(async reaction => await helpMessage.react(reaction) );

    function switchCategory(category, title) {
      helpEmbed.setTitle(title);
      helpEmbed.setDescription(`For more information on a certain command you can type \`${prefix}help <command name>\``);
    
      helpEmbed.fields = [];
    
      client.commands.forEach(command => {
        if (command.category !== category) return;
    
        helpEmbed.addField(`\`${prefix}${command.name}\``, command.description || "\u200b");
      });
    }

    // Create reaction collector
    const collector = helpMessage.createReactionCollector((reaction, user) => user.id === message.author.id);

    collector.on("collect", async reaction => {
      const emoji = reaction.emoji.name;

      switch (emoji) {
      case "🥳":
        switchCategory("fun", "🥳 Fun commands");
        break;
      case "💵":
        switchCategory("economy", "💵 Economy commands");
        break;
      case "👤":
        switchCategory("member", "👤 Member commands");
        break;
      case "🖌️":
        switchCategory("canvas", "🖌️ Canvas commands");
        break;
      case "🛠️":
        switchCategory("utility", "🛠️ Utility commands");
        break;
      case "🔒":
        switchCategory("admin", "🔒 Admin commands");
        break;
      }

      await helpMessage.edit(helpEmbed);
    });
  }
};