module.exports = {
  name: 'help',
  description: 'Displays information about a specific command.',
  aliases: ['commands', 'father-i-need-help'],
  usage: '<command name>',
  async execute (client, message, args) {
    const prefix = (await client.models[message.guild.name].variables.findByPk('prefix')).value;
    const homePage = new client.discord.MessageEmbed()
      .setTitle('home')
      .setColor(client.config.embedColor);

    const toolsPage = new client.discord.MessageEmbed()
      .setTitle('tools')
      .setColor(client.config.embedColor);

    const adminPage = new client.discord.MessageEmbed()
      .setTitle('admin')
      .setColor(client.config.embedColor);

    const funPage = new client.discord.MessageEmbed()
      .setTitle('fun')
      .setColor(client.config.embedColor);

    const helpEmbed = await message.channel.send(homePage);

    await helpEmbed.react('🛠️');
    await helpEmbed.react('🥳');
    await helpEmbed.react('🕴️');
    await helpEmbed.react('🏠');
  }
};