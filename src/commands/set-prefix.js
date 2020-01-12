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
    const prefix = await client.model.variables.findByPk('prefix');

    console.log(prefix);

    await prefix.update({ value: args[0] });

    return message.channel.send(`Set guild prefix to \`${args[0]}\`.`);
  }
};