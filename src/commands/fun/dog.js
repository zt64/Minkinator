module.exports = {
  description: "Gets a random dog image.",
  async execute (client, message) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    const dogEmbed = new Discord.MessageEmbed({
      color: colors.default,
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
