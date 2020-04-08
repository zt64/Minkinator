module.exports = {
  description: 'Get the definition for a word.',
  aliases: ['dict', 'define', 'def'],
  async execute (client, message, args) {
    const fetch = client.fetch;
    const querystring = require('querystring');
    const query = querystring.stringify({ term: args.join(' ') });

    const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());

    const [answer] = list;

    if (!list.length) return message.channel.send(`No results for \`${args.join(' ')}\``);

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle(`Definition of ${answer.word}`)
      .addField('Definition:', answer.definition)
      .addField('Example:', answer.example)
      .setURL(answer.permalink)
    );
  }
};