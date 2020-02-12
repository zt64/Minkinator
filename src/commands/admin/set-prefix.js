module.exports = {
  name: 'set-prefix',
  description: 'Sets the current guilds prefix.',
  parameters: [
    {
      name: 'prefix',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const prefixVariable = await client.model.variables.findByPk('prefix');
    const prefix = args[0];

    await prefixVariable.update({ value: prefix });

    return message.channel.send(new client.discord.MessageEmbed()
      .setTitle('Succesfully changed prefix')
      .setColor(client.config.embed.color)
      .setDescription(`Set guild prefix to \`${prefix}\`.`)
    );
  }
};