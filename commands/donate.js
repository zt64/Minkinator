module.exports = {
  name: 'donate',
  description: 'Donate to the mink project.',
  usage: '[amount]',
  args: true,
  async execute (client, message, args) {
    if (args[0] < 1 || isNaN(args[0])) return message.reply('That is not a valid amount.');

    const user = await client.models.members.findByPk(message.author.id);
    const project = await client.models.variables.findByPk('minkProject');
    const amount = Math.floor(parseInt(args[0]));

    if (user.balance - amount >= 0) {
      await user.update({ balance: user.balance - amount });
      await project.update({ value: parseInt(project.value) + amount });

      return message.reply(`Thank you for donating ${client.config.currency}${amount} to the mink project. \nThe mink project now stands at a balance of ${client.config.currency}${project.value}.`);
    } else {
      return message.reply(`You are missing the additional ${client.config.currency}${Math.abs(amount - user.balance)}.`);
    }
  }
};
