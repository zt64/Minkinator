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
    cityName = encodeURIComponent(cityName);
    
    // Fetch data from API
    const data = await util.fetchJSON(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${global.config.auth.openWeatherMap}`);

    if (data.cod === "404") return message.reply("Invalid location.");

    const { weather, main } = data;

    return message.reply({
      embed: {
        color: global.config.colors.default,
        title: `Weather for ${data.name}`,
        fields: [
          { name: "Longitude:", value: data.coord.lon, inline: true },
          { name: "Latitude:", value: data.coord.lat, inline: true },
          { name: "Weather:", value: weather[0].main, inline: true },
          { name: "Weather Description:", value: weather[0].description, inline: true },
          { name: "Temperature:", value: `${util.kToC(main.temp)} C`, inline: true },
          { name: "Feels Like:", value: `${util.kToC(main.feels_like)} C`, inline: true },
          { name: "Minimum Temperature:", value: `${util.kToC(main.temp_min)} C`, inline: true },
          { name: "Maximum Temperature:", value: `${util.kToC(main.temp_max)} C`, inline: true },
          { name: "Pressure:", value: main.pressure },
          { name: "Humidity:", value: main.humidity },
          { name: "Visibility:", value: `${util.formatNumber(parseInt(data.visibility))} m`, inline: true },
          { name: "Wind Speed:", value: data.wind.speed },
          { name: "Wind Direction:", value: data.wind.deg },
          { name: "Clouds:", value: data.clouds.all },
          { name: "Country Code:", value: data.sys.country }
        ]
      }
    });
  }
};
