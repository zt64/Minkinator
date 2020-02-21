module.exports = {
  description: 'Gets a randomly generated cat image from the internet.',
  async execute (client, message, args) {
    const fetch = client.fetch;

    const { file } = fetch('https://aws.random.cat/meow').then(response => response.json());

    const catEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('Cat')
      .setImage(file);

    return message.channel.send(catEmbed)
  }
}