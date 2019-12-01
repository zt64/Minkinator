module.exports = {
  name: 'reset',
  description: 'Resets a members data.',
  permissions: ['ADMINISTRATOR'],
  usage: '[member]',
  args: true,
  async execute (client, message, args) {
    const member = message.mentions.users.first();
    const data = await client.models[message.guild.name].members.findByPk(member.id);

    await data.destroy();
    await client.models[message.guild.name].members.create({ name: member.tag, id: member.id });

    return message.channel.send(`${member.tag}'s data has been reset.`);
  }
};
