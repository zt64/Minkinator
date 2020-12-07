module.exports = {
  description: "Gets a random cat image.",
  parameters: [
    {
      name: "breed",
      type: String
    }
  ],
  async execute (client, message, args) {
    const guildConfig = global.guildInstance.config;
    const defaultColor = guildConfig.colors.default;

    const search = args.join(" ");

    const catEmbed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setFooter("Source: https://api.thecatapi.com");

    // Fetch a random image if unspecified
    if (!search) {
      const cats = await global.fetch("https://api.thecatapi.com/v1/images/search").then(res => res.json());
      const [ cat ] = cats;

      catEmbed.setTitle("Random cat");
      catEmbed.setURL(cat.url);
      catEmbed.setImage(cat.url);

      return message.channel.send(catEmbed);
    }

    // Check if a breed exists and fetch an image for it
    const breeds = await global.fetch(`https://api.thecatapi.com/v1/breeds/search?q=${search}`).then(res => res.json());
    const [ breed ] = breeds;

    if (breeds.length === 0) return message.channel.send(`No images found for \`${search}\`.`);

    const cats = await global.fetch(`https://api.thecatapi.com/v1/images/search/?breed_id=${breed.id}`).then(res => res.json());
    const [ cat ] = cats;

    if (!cat) return message.channel.send(`No images found for \`${search}\`.`);

    catEmbed.setTitle(`${breed.name} cat`);
    catEmbed.setURL(cat.url);
    catEmbed.setImage(cat.url);

    return message.channel.send(catEmbed);
  }
};