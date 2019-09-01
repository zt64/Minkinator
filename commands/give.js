module.exports = {
  name: 'give',
  description: 'Gives money to another user.',
  aliases: ['send'],
  usage: '[user] [amount]',
  args: true,
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid user.`)
    const target = await client.models.users.findOne({ where: { id: message.mentions.members.first().id } })
    const user = await client.models.users.findOne({ where: { id: message.author.id } })

    if (user.balance - args[1] >= 0 && !isNaN(args[1])) {
      await user.update({ balance: user.balance - parseInt(args[1]) })
      await target.update({ balance: target.balance + parseInt(args[1]) })
      message.channel.send(`${message.author} has sent ${client.config.currency}${args[1]} to ${args[0]}`)
    }
  }
}
