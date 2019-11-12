module.exports = {
  name: 'help',
  description: 'Displays information about a specific command.',
  usage: '<command name>',
  aliases: ['commands'],
  async execute (client, message, args) {
    const prefix = (await client.models.variables.findByPk('prefix')).value;
    const embed = new client.discord.MessageEmbed()
      .setColor('#1ED760');

    if (!args.length) {
      embed.setTitle('You have summoned I, the Minkinator. What shall I do today?');
      embed.setDescription(`You can send \`${prefix}help <command name>\` to get info on a specific command.`);
      embed.setThumbnail(client.user.avatarURL());
      embed.addField('**Commands**', `${client.commands.map(command => {
          if (command.permissions && !message.member.hasPermission(command.permissions)) {
            return;
          }
          return command.name;
        }).filter(Boolean).join(', ')}`);
      embed.setFooter('Created by Litleck');
      embed.setTimestamp();

      return message.channel.send(embed);
    }

    const name = args[0].toLowerCase();
    const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command || (command.permissions && !message.member.hasPermission(command.permissions))) return message.reply("That's not a valid command.");

    embed.addField('**Command**:', command.name, true);

    if (command.aliases) embed.addField('**Aliases**:', command.aliases.join(', '), true);
    if (command.description) embed.addField('**Description**:', command.description, true);
    if (command.usage) embed.addField('**Usage**:', command.usage, true);

    embed.addField('**Cooldown**:', `${command.cooldown || 3} second(s)`, true);
    embed.addField('**Permissions**:', command.permissions ? command.permissions.join(', ') : 'Everyone', true);

    embed.setFooter('Created by Litleck');
    embed.setTimestamp();
    return message.channel.send(embed);
  }
};
