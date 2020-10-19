module.exports = {
  name: "map",
  parameters: [
    {
      name: "search",
      required: true
    }
  ],
  async execute (client, message, args) {
    const guildConfig = global.guildInstance.config;
    const defaultColor = guildConfig.colors.default;

    const key = global.auth.mapbox;
    const search = args.join(" ");

    const geocode = await global.functions.fetchJSON(`https://api.mapbox.com/geocoding/v5/mapbox.places/${args.join("%20")}.json?access_token=${key}`);

    if (!geocode.features.length) return message.channel.send(`\`${search}\` could not be located.`);

    const features = geocode.features;
    const feature = features[0];

    const longitude = feature.center[0];
    const latitude = feature.center[1];

    const map = await global.fetch(`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/${longitude},${latitude},8,0/1024x1024?access_token=${key}`);
    const url = map.url;

    const embed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle(feature.place_name)
      .setURL(url)
      .setImage(url)
      .setFooter(`Query: ${search} | Powered by Mapbox`);
    
    return message.channel.send(embed);
  }
};
