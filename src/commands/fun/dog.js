module.exports = {
  description: "Gets a random dog image.",
  async execute (client, message) {
    const guildConfig = global.guildInstance.config;
    const defaultColor = guildConfig.colors.default;

    const dogEmbed = new Discord.MessageEmbed({
      color: defaultColor,
      footer: { text: "Source: https://random.dog/woof.json" }
    });
    
    let dog = await util.fetchJSON("https://random.dog/woof.json");

    while (dog.url.endsWith("mp4")) dog = await util.fetchJSON("https://random.dog/woof.json");

    dogEmbed.setTitle("Random Dog");
    dogEmbed.setURL(dog.url);
    dogEmbed.setImage(dog.url);

    return message.channel.send(dogEmbed);
  }
};
