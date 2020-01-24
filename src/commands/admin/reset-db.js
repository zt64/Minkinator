module.exports = {
  name: 'reset-db',
  category: 'Administrator',
  description: 'Resets a guilds database',
  permissions: ['ADMINISTRATOR'],
  async execute (client, message, args) {
    await client.model.drop();
    return message.channel.send('Successfully reset the database.');
  }
};