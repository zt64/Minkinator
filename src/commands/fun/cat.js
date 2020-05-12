module.exports = {
  description: 'Gets a random cat image from the internet.',
  parameters: [
    {
      name: 'breed',
      type: String
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.colors.success;

    const search = args.join(' ');

    const catEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setFooter('Source: https://api.thecatapi.com');

    if (!search) {
      const cats = await client.fetch('https://api.thecatapi.com/v1/images/search').then(response => response.json());
      const cat = cats[0];

      catEmbed.setTitle('Random cat');
      catEmbed.setURL(cat.url);
      catEmbed.setImage(cat.url);

      return message.channel.send(catEmbed);
    }

    const breeds = await client.fetch(`https://api.thecatapi.com/v1/breeds/search?q=${search}`).then(response => response.json());
    const breed = breeds[0];

    if (breeds.length === 0) return message.channel.send(`No images found for \`${search}\`.`);

    const cats = await client.fetch(`https://api.thecatapi.com/v1/images/search/?breed_id=${breed.id}`).then(response => response.json());
    const cat = cats[0];

    if (!cat) return message.channel.send(`No images found for \`${search}\`.`);

    catEmbed.setTitle(`${breed.name} cat`);
    catEmbed.setURL(cat.url);
    catEmbed.setImage(cat.url);

    return message.channel.send(catEmbed);
  }
};
