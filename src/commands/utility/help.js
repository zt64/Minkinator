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
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;
    const prefix = guildConfig.prefix;

    const helpEmbed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setFooter(`Created by Litleck (${await client.users.fetch(global.config.ownerID).then(user => user.tag)})`);

    if (commandName) {
      const command = client.commands.get(commandName.toLowerCase()) || client.commands.find(c => c.aliases && c.aliases.includes(commandName.toLowerCase()));

      if (!command || (command.permissions && !message.member.hasPermission(command.permissions))) {
        return message.channel.send(new global.Discord.MessageEmbed()
          .setColor(defaultColor)
          .setTitle("Invalid Command")
          .setDescription(`\`${commandName}\` is not a valid command.`));
      }

      helpEmbed.addField("Command:", command.name, true);
      helpEmbed.addField("Category:", command.category, true);
      helpEmbed.addField("Description:", command.description);
      helpEmbed.addField("Cool down:", global.pluralize("second", command.coolDown || 3, true), true);
      helpEmbed.addField("Permissions:", command.permissions ? command.permissions.join(", ") : "Everyone", true);

      if (command.aliases) helpEmbed.addField("Aliases:", command.aliases.join(", "), true);

      if (command.parameters) {
        const array = command.parameters.map(parameter => parameter.required ? `[${parameter.name}]` : `<${parameter.name}>`);

        helpEmbed.addField("Proper usage", `\`${prefix}${commandName} ${array.join(" ")}\``);
      }

      return message.channel.send(helpEmbed);
    }

    helpEmbed.setDescription(`For more information on a certain command you can type \`${prefix}help <command name>\``);

    function addCategories () {
      helpEmbed.setTitle("Home page");
      helpEmbed.setDescription(`There is a total of 5 command categories. For information on a specific command, run: \`${prefix}help <command>\``);
      helpEmbed.addField("Fun", "Fun commands to play around with.");
      helpEmbed.addField("Economy", "Buy, sell, and make a profit.");
      helpEmbed.addField("Member", "Member related commands.");
      helpEmbed.addField("Canvas", "Manipulate an image as you desire.");
      helpEmbed.addField("Utility", "Tools for the more technical.");
      helpEmbed.addField("Admin", "Take control of a server.");
    }

    addCategories();

    const helpMessage = await message.channel.send(helpEmbed);

    function populate (category) {
      client.commands.forEach(command => {
        if (command.category !== category) return;

        helpEmbed.addField(`\`${prefix}${command.name}\``, command.description || "\u200b");
      });
    }

    async function react (reactions) {
      reactions.map(async reaction => {
        helpMessage.react(reaction);
        await global.functions.sleep(200);
      });
    }

    await react(["🥳", "💵", "👤", "🖌️", "🛠️", "🔒"]);

    // Create reaction collector
    const filter = (reaction, user) => user.id === message.author.id;

    const collector = helpMessage.createReactionCollector(filter);

    collector.on("collect", async reaction => {
      const emoji = reaction.emoji.name;

      switch (emoji) {
      case "🏠":
        helpEmbed.setTitle("Home page");
        helpEmbed.setDescription("There is a total of 6 command categories ");

        helpEmbed.fields = [];

        addCategories();
        break;
      case "🥳":
        helpEmbed.setTitle("Fun commands");

        helpEmbed.fields = [];

        populate("fun");
        break;
      case "💵":
        helpEmbed.setTitle("Economy commands");

        helpEmbed.fields = [];

        populate("economy");
        break;
      case "👤":
        helpEmbed.setTitle("Member commands");

        helpEmbed.fields = [];

        populate("member");
        break;
      case "🖌️":
        helpEmbed.setTitle("Canvas commands");

        helpEmbed.fields = [];

        populate("canvas");
        break;
      case "🛠️":
        helpEmbed.setTitle("Utility commands");

        helpEmbed.fields = [];

        populate("utility");
        break;
      case "🔒":
        helpEmbed.setTitle("Admin commands");

        helpEmbed.fields = [];

        populate("admin");
        break;
      }

      await helpMessage.edit(helpEmbed);
    });
  }
};