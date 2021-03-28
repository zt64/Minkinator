const fetch = require("node-fetch");

module.exports = {
  description: "Gets a random cat image.",
  parameters: [
    {
      name: "breed",
      type: String
    }
  ],
  aliases: [ "kitty" ],
  async execute (_, message, args) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    const search = args.join(" ");

    const catEmbed = new Discord.MessageEmbed({
      color: colors.default,
      footer: { text: "Source: https://api.thecatapi.com" }
    });

    // Fetch a random image if unspecified
    if (!search) {
      const cats = await fetch("https://api.thecatapi.com/v1/images/search").then(res => res.json());
      const [ cat ] = cats;

      catEmbed.setTitle("Random cat");
      catEmbed.setURL(cat.url);
      catEmbed.setImage(cat.url);

      return message.reply(catEmbed);
    }

    // Check if a breed exists and fetch an image for it
    const breeds = await fetch(`https://api.thecatapi.com/v1/breeds/search?q=${search}`).then(res => res.json());
    const [ breed ] = breeds;

    if (breeds.length === 0) return message.reply(`No images found for \`${search}\`.`);

    const cats = await fetch(`https://api.thecatapi.com/v1/images/search/?breed_id=${breed.id}`).then(res => res.json());
    const [ cat ] = cats;

    if (!cat) return message.reply(`No images found for \`${search}\`.`);

    catEmbed.setTitle(`${breed.name} cat`);
    catEmbed.setURL(cat.url);
    catEmbed.setImage(cat.url);

    return message.reply(catEmbed);
  }
};