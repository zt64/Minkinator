module.exports = {
  description: 'Gets a random cat image from the internet.',
  parameters: [
    {
      name: 'breed',
      type: String
    }
  ],
  async execute (client, message, args) {
    const search = args.join(' ');

    const catEmbed = new client.Discord.MessageEmbed()
      .setColor(client.config.embed.color);

    if (search) {
      const breeds = await client.fetch(`https://api.thecatapi.com/v1/breeds/search?q=${search}`).then(response => response.json());
      const breed = breeds[0];

      if (breeds.length === 0) return message.channel.send(`No images found for \`${search}\`.`);

      const cats = await client.fetch(`https://api.thecatapi.com/v1/images/search/?breed_id=${breed.id}`).then(response => response.json());
      const cat = cats[0];

      if (!cat) return message.channel.send(`No images found for \`${search}\`.`);

      catEmbed.setTitle(`${breed.name} cat`);
      catEmbed.setImage(cat.url);

      return message.channel.send(catEmbed);
    } else {
      const cats = await client.fetch('https://api.thecatapi.com/v1/images/search').then(response => response.json());
      const cat = cats[0];

      catEmbed.setTitle('Random cat');
      catEmbed.setImage(cat.url);

      return message.channel.send(catEmbed);
    }
  }
};
