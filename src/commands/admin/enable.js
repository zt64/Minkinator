module.exports = {
  description: 'Enable a command.',
  async execute (client, message, args) {
    const commands = client.database.properties.findByPk('commands').then(key => key.value);
  }
};