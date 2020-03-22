module.exports = {
  description: 'Donate to the mink project.',
  parameters: [
    {
      name: 'amount',
      type: Number
    }
  ],
  async execute (client, message, args) {
    const guildConfig = (await client.database.properties.findByPk('configuration')).value;
    const user = await client.databases.members.findByPk(message.author.id);
    const project = await client.databases.properties.findByPk('minkProject');
    const amount = Math.floor(parseInt(args[0]));
    const currency = guildConfig.currency;

    if (args[0] < 1 || isNaN(args[0])) return message.reply('That is not a valid amount.');

    if (user.balance - amount >= 0) {
      await user.update({ balance: user.balance - amount });
      await project.update({ value: parseInt(project.value) + amount });

      return message.reply(`Thank you for donating ${currency}${amount} to the mink project. \nThe mink project now stands at a balance of ${currency}${project.value}.`);
    } else {
      return message.reply(`You are missing the additional ${currency}${Math.abs(amount - user.balance)}.`);
    }
  }
};