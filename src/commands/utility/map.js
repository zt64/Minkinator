module.exports = {
  name: "map",
  parameters: [
    {
      name: "longitude",
      type: Number,
      required: true
    },
    {
      name: "latitude",
      type: Number,
      required: true
    }
  ],
  async execute (client, message, args) {
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;

    const key = global.auth.mapbox;

    const [longitude, latitude] = args;

    const url = (await global.fetch(`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/${longitude},${latitude},8,0/1024x1024?access_token=${key}`)).url;

    console.log(url);

    const embed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setImage(url);
    
    return message.channel.send(embed);
  }
};
