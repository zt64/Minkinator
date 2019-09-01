module.exports = {
  name: 'mink-project',
  description: 'Information about the mink project.',
  aliases: ['mp'],
  async execute (client, message) {
    const balance = await client.models.variables.findByPk('minkProject')
    message.channel.send(`The mink project stands at a balance of ${client.config.currency}${balance.value}.`)
  }
}
