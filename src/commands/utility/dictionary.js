module.exports = {
  name: 'dictionary',
  description: 'Get the definition for a word.',
  aliases: ['dict', 'define', 'def'],
  async execute (client, message, args) {
    const dictionary = (await client.fetch(`https://api.urbandictionary.com/v0/define?term=${args[0]}`)).json();

    return message.channel.send(client.discord.messageEmbed()
      .setColor(client.config.embedColor)
      .setTitle('Dictionary')
      .setDescription()
    );
  }
};