module.exports = {
  description: 'Get weather forecast for a location.',
  parameters: [
    {
      name: 'latitude',
      type: Number,
      range: [-90, 90],
      required: true
    },
    {
      name: 'longitude',
      type: Number,
      range: [-180, 180],
      required: true
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.embedColors.success;

    const latitude = args[0];
    const longitude = args[1];

    const key = client.tokens.darkSky;
    const weather = await client.fetch(`https://api.darksky.net/forecast/${key}/${latitude},${longitude}`).then(response => response.json());

    const currently = weather.currently;
    const temp = currently.temperature;

    const weatherEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle(`Weather for ${latitude}, ${longitude}`)
      .setURL(`https://darksky.net/forecast/${latitude},${longitude}`)
      .setDescription(`${currently.summary}.`)
      .addField('Temperature:', `${temp} °F (${client.functions.fToC(temp).toFixed(2)} °C)`, true)
      .addField('Humidity:', `${currently.humidity * 100}%`, true)
      .addField('Pressure:', `${currently.pressure} hPa`, true)
      .setFooter('Powered by Dark Sky');

    return message.channel.send(weatherEmbed);
  }
};