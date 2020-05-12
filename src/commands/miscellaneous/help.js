module.exports = {
  description: 'View available commands and their information.',
  aliases: ['commands'],
  parameters: [
    {
      name: 'command name',
      type: String
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.colors.success;
    const prefix = guildConfig.prefix;

    if (args[0]) {
      const commandName = args[0].toLowerCase();
      const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));

      if (!command || (command.permissions && !message.member.hasPermission(command.permissions))) {
        return message.channel.send(new client.Discord.MessageEmbed()
          .setColor(successColor)
          .setTitle('Invalid Command')
          .setDescription(`\`${commandName}\` is not a valid command.`));
      }

      const helpEmbed = new client.Discord.MessageEmbed()
        .setColor(successColor)
        .addField('Command:', command.name, true)
        .addField('Category:', command.category, true)
        .addField('Description:', command.description)
        .addField('Cool down:', client.pluralize('second', command.coolDown || 3, true), true)
        .addField('Permissions:', command.permissions ? command.permissions.join(', ') : 'Everyone', true)
        .setFooter(`Created by Litleck (${await client.users.fetch(client.config.ownerID).then(user => user.tag)})`);

      if (command.aliases) helpEmbed.addField('Aliases:', command.aliases.join(', '), true);

      if (command.parameters) {
        let parameters = '';

        command.parameters.map(parameter => {
          parameter.required ? parameters += `[${parameter.name}] ` : parameters += `<${parameter.name}> `;
        });

        var usage = `\`${prefix}${command.name} ${parameters}\``;
      }

      helpEmbed.addField('Usage:', usage);

      return message.channel.send(helpEmbed);
    }

    const helpEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle('Home page')
      .setDescription(`There is a total of 5 command categories. For information on a specific command, run: \`${prefix}help <command>\``)
      .addField('Fun', 'Fun commands to play around with.')
      .addField('Utility', 'Tools for the more technical.')
      .addField('Admin', 'Take control of a guild.')
      .addField('Economy', 'Buy, sell, and make a profit.')
      .setFooter(`Created by Litleck (${await client.users.fetch(client.config.ownerID).then(user => user.tag)})`);

    const helpMessage = await message.channel.send(helpEmbed);

    function populate (category) {
      client.commands.map((command, index) => {
        if (command.category !== category) return;

        helpEmbed.addField(`\`${prefix}${command.name}\``, command.description || '\u200b');
      });
    }

    async function react (reactions) {
      await reactions.map(reaction => helpMessage.react(reaction));
    }

    await react(['🥳', '💵', '👤', '🖌️', '🛠️', '🔒', '❔', '❌']);

    // Create reaction collector

    const filter = (reaction, user) => user.id === message.author.id && (
      ['🏠', '🛠️', '🥳', '🔒', '❌'].map(emoji => reaction.emoji.name === emoji)
    );

    const collector = helpMessage.createReactionCollector(filter);

    collector.on('collect', async reaction => {
      const emoji = reaction.emoji.name;

      switch (emoji) {
        case '🏠':
          helpEmbed.setTitle('Home page');
          helpEmbed.setDescription('There is a total of 3 command categories ');

          helpEmbed.fields = [];

          helpMessage.reactions.removeAll();

          await react(['🥳', '💵', '👤', '🖌️', '🛠️', '🔒', '❔', '❌']);

          break;
        case '🥳':
          helpEmbed.setTitle('Fun commands');
          helpEmbed.setDescription(`You can send \`${prefix}help <command name>\` to get info on a specific command.`);

          helpEmbed.fields = [];

          populate('fun');

          helpMessage.reactions.removeAll();

          react(['🏠', '❌']);

          break;
        case '💵':
          helpEmbed.setTitle('Economy commands');
          helpEmbed.setDescription(`For more information on a certain command you can type \`${prefix}help <command name>\``);

          helpEmbed.fields = [];

          populate('economy');

          helpMessage.reactions.removeAll();

          react(['🏠', '❌']);

          break;
        case '👤':
          helpEmbed.setTitle('Member commands');
          helpEmbed.setDescription(`For more information on a certain command you can type \`${prefix}help <command name>\``);

          helpEmbed.fields = [];

          populate('member');

          helpMessage.reactions.removeAll();

          react(['🏠', '❌']);

          break;
        case '🖌️':
          helpEmbed.setTitle('Canvas commands');
          helpEmbed.setDescription(`For more information on a certain command you can type \`${prefix}help <command name>\``);

          helpEmbed.fields = [];

          populate('canvas');

          helpMessage.reactions.removeAll();

          react(['🏠', '❌']);

          break;
        case '🛠️':
          helpEmbed.setTitle('Utility commands');
          helpEmbed.setDescription(`For more information on a certain command you can type \`${prefix}help <command name>\``);

          helpEmbed.fields = [];

          populate('utility');

          helpMessage.reactions.removeAll();

          react(['🏠', '❌']);

          break;
        case '🔒':
          helpEmbed.setTitle('Admin commands');
          helpEmbed.setDescription(`You can send \`${prefix}help <command name>\` to get info on a specific command.`);

          helpEmbed.fields = [];

          populate('admin');

          helpMessage.reactions.removeAll();

          react(['🏠', '❌']);

          break;
        case '❔':
          helpEmbed.setTitle('Miscellaneous commands');
          helpEmbed.setDescription(`You can send \`${prefix}help <command name>\` to get info on a specific command.`);

          helpEmbed.fields = [];

          populate('miscellaneous');

          helpMessage.reactions.removeAll();

          react(['🏠', '❌']);

          break;
        case '❌':
          return helpMessage.delete();
      }

      await helpMessage.edit(helpEmbed);
    });
  }
};