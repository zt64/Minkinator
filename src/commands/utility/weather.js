module.exports = {
  description: "Get weather forecast for a location.",
  parameters: [
    {
      name: "city",
      type: String,
      required: true
    }
  ],
  async execute (client, message, [ cityName ]) {
    const guildConfig = global.guildInstance.config;
    const defaultColor = guildConfig.colors.default;

    const { fetchJSON, kToC, formatNumber } = global.util;

    // Fetch data from API
    const data = await fetchJSON(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${global.auth.openWeatherMap}`);

    console.log(data);

    if (data.cod === "404") return message.channel.send("Invalid location.");

    const { weather } = data;
    const { main } = data;

    const embed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle(`Weather for ${data.name}`)
      .addField("Longitude:", data.coord.lon, true)
      .addField("Latitude:", data.coord.lat, true)
      .addField("Weather:", weather[0].main, true)
      .addField("Weather Description:", weather[0].description, true)
      .addField("Temperature:", `${kToC(main.temp)} C`, true)
      .addField("Feels Like:", `${kToC(main.feels_like)} C`, true)
      .addField("Minimum Temperature:", `${kToC(main.temp_min)} C`, true)
      .addField("Maximum Temperature:", `${kToC(main.temp_max)} C`, true)
      .addField("Pressure:", `${main.pressure}`)
      .addField("Humidity:", `${main.humidity}`)
      .addField("Visibility:", `${formatNumber(parseInt(data.visibility))} m`)
      .addField("Wind Speed:", data.wind.speed, true)
      .addField("Wind Direction:", data.wind.deg, true)
      .addField("Clouds:", data.clouds.all)
      .addField("Country Code:", data.sys.country);

    return message.channel.send(embed);
  }
};