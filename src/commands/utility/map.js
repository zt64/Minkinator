const fetch = require("node-fetch");

module.exports = {
  name: "map",
  description: "Get a satellite image view of a location.",
  parameters: [
    {
      name: "search",
      required: true
    }
  ],
  async execute (client, message, args) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    const key = global.config.auth.mapbox;
    const search = args.join(" ");

    const geocode = await util.fetchJSON(`https://api.mapbox.com/geocoding/v5/mapbox.places/${args.join("%20")}.json?access_token=${key}`);

    if (!geocode.features.length) return message.channel.send(`\`${search}\` could not be located.`);

    const { features } = geocode;
    const [ feature ] = features;

    const [ longitude, latitude ] = feature.center;

    const map = await fetch(`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/${longitude},${latitude},8,0/1024x1024?access_token=${key}`);
    const { url } = map;

    return message.channel.send(new Discord.MessageEmbed({
      color: colors.default,
      title: feature.place_name,
      url: url,
      image: { url },
      footer: { text: `Query: ${search} | Powered by Mapbox` }
    }));
  }
};
