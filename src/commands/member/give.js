module.exports = {
  description: 'Send money to another member.',
  aliases: ['send', 'pay'],
  parameters: [
    {
      name: 'member',
      type: String,
      required: true
    },
    {
      name: 'amount',
      type: Number,
      required: true
    }
  ],
  async execute (client, message, args) {
    const guildConfig = (await client.database.properties.findByPk('configuration')).value;
    const currency = guildConfig.currency;

    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);
    if (args[1] < 1 || isNaN(args[1])) return message.reply('That is not a valid amount.');

    const target = await client.database.members.findByPk(message.mentions.members.first().id);
    const member = await client.database.members.findByPk(message.author.id);

    if (member.balance - args[1] >= 0) {
      await member.decrement('balance', { by: parseInt(args[1])})
      await target.increment('balance', { by: parseInt(args[1])})

      return message.channel.send(new client.discord.MessageEmbed()
        .setTitle('Payment Transaction')
        .setColor(client.config.embed.color)
        .setDescription(`${message.author} has sent ${currency}${args[1]} to ${message.mentions.members.first()}`)
        .addField(`${message.author.username}'s new balance:`, `${currency}${member.balance}`, true)
        .addField(`${message.mentions.members.first().user.username}'s new balance:`, `${currency}${target.balance}`, true)
        .setTimestamp()
      );
    } else {
      return message.reply(`You are missing the additional ${currency}${Math.abs(args[1] - member.balance)}.`);
    }
  }
};