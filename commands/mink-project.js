module.exports = {
  name: 'mink-project',
  description: 'Information about the mink project.',
  aliases: ['mp'],
  async execute (client, message) {
    const balance = await client.models.variables.findByPk('minkProject');

    return message.channel.send(`The mink project currenctly stands at a balance of ${client.config.currency}${balance.value}.`);
  }
};
