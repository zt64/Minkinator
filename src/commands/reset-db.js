module.exports = {
  name: 'reset-db',
  category: 'Administrator',
  description: 'Resets a guilds database',
  permissions: ['ADMINISTRATOR'],
  async execute (client, message, args) {
    await client.models[message.guild.name].drop();
    return message.channel.send('Successfully reset the database.');
  }
};