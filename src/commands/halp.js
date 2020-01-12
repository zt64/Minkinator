module.exports = {
  name: 'help',
  description: 'Displays information about a specific command.',
  aliases: ['commands', 'father-i-need-help'],
  parameters: [
    {
      name: 'command name',
      type: String
    }
  ],
  async execute (client, message, args) {
    const prefix = (await client.model.variables.findByPk('prefix')).value;

    const helpEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle('Home page')
      .setDescription('There is a total of 3 command categories ');

    const helpMessage = await message.channel.send(helpEmbed);

    ['🛠️', '🥳', '🕴️', '❌'].map(reaction => helpMessage.react(reaction));

    const filter = (reaction, user) => user.id === message.author.id && (
      reaction.emoji.name === '🏠' ||
        reaction.emoji.name === '🛠️' ||
        reaction.emoji.name === '🥳' ||
        reaction.emoji.name === '🕴️' ||
        reaction.emoji.name === '❌'
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

          ['🛠️', '🥳', '🕴️', '❌'].map(reaction => helpMessage.react(reaction));

          break;
        case '🛠️':
          helpEmbed.setTitle('Utility commands');
          helpEmbed.setDescription(`For more information on a certain command you can type \`${prefix}help <command name>\``);

          client.commands.map((command, index) => {
            if (command.category !== 'Utility') return;
            helpEmbed.addField(`\`\`${prefix}${command.name}\`\``, command.description);
          });

          helpMessage.reactions.removeAll();

          ['🏠', '❌'].map(reaction => helpMessage.react(reaction));

          break;
        case '🥳':
          helpEmbed.setTitle('Fun commands');
          helpEmbed.setDescription(`You can send \`${prefix}help <command name>\` to get info on a specific command.`);

          client.commands.map((command, index) => {
            if (command.category !== 'Fun') return;
            helpEmbed.addField(`\`\`${prefix}${command.name}\`\``, command.description);
          });

          helpMessage.reactions.removeAll();

          ['🏠', '❌'].map(reaction => helpMessage.react(reaction));

          break;
        case '🕴️':
          helpEmbed.setTitle('Administrator commands');
          helpEmbed.setDescription(`You can send \`${prefix}help <command name>\` to get info on a specific command.`);

          client.commands.map((command, index) => {
            if (command.category !== 'Administrator') return;

            helpEmbed.addField(`\`\`${prefix}${command.name}\`\``, command.description);
          });

          helpMessage.reactions.removeAll();

          ['🏠', '❌'].map(reaction => helpMessage.react(reaction));

          break;
        case '❌':
          return helpMessage.delete();
      }

      await helpMessage.edit(helpEmbed);
    });
  }
};