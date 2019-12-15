module.exports = {
  name: 'set-prefix',
  description: 'Sets the current guilds prefix.',
  usage: '[prefix]',
  args: true,
  async execute (client, message, args) {
    const prefix = await client.models[message.guild.name].variables.findByPk('prefix');

    console.log(prefix);

    await prefix.update({ value: args[0] });

    return message.channel.send(`Set guild prefix to \`${args[0]}\`.`);
  }
};
