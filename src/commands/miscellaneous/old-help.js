module.exports = {
  description: 'Information regarding commands and their usage.',
  aliases: ['commands'],
  parameters: [
    {
      name: 'command',
      type: String
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const prefix = guildConfig.prefix;
    const successColor = guildConfig.embedColors.success;
    const embed = new client.Discord.MessageEmbed()
      .setColor(successColor);

    if (!args.length) {
      embed.setTitle('You have summoned I, the Minkinator. What shall I do today?');
      embed.setDescription(`You can send \`${prefix}help <command name>\` to get info on a specific command.`);
      embed.setAuthor('List of commands', client.user.avatarURL());
      embed.addField('**Commands**', `${client.commands.map(command => {
          if (command.permissions && !message.member.hasPermission(command.permissions)) return;
          return command.name;
        }).filter(Boolean).join(', ')}`);
      embed.setFooter(`Created by Litleck (${await client.users.fetch(client.config.ownerID).then(user => user.tag)})`);

      return message.channel.send(embed);
    }

    const name = args[0].toLowerCase();
    const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command || (command.permissions && !message.member.hasPermission(command.permissions))) {
      return message.channel.send(new client.Discord.MessageEmbed()
        .setColor(successColor)
        .setTitle('Invalid Command')
        .setDescription(`\`${name}\` is not a valid command.`));
    }

    embed.addField('**Command**:', command.name, true);

    if (command.aliases) embed.addField('**Aliases**:', command.aliases.join(', '), true);
    if (command.description) embed.addField('**Description**:', command.description, true);
    if (command.usage) embed.addField('**Usage**:', command.usage, true);

    embed.addField('**Cool down**:', client.pluralize('second', command.coolDown || 3, true), true);
    embed.addField('**Permissions**:', command.permissions ? command.permissions.join(', ') : 'Everyone', true);

    embed.setFooter(`Created by Litleck (${await client.users.fetch(client.config.ownerID).then(user => user.tag)})`);

    return message.channel.send(embed);
  }
};