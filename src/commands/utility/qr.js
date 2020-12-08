const fetch = require("node-fetch");
const entities = require("entities");

module.exports = {
  description: "Generates a QR code using the input.",
  parameters: [
    {
      name: "input",
      required: true
    }
  ],
  async execute (client, message, args) {
    const text = args.join(" ");
    const data = entities.encodeHTML(text);

    const response = await fetch(`https://image-charts.com/chart?chs=150x150&cht=qr&chl=${data}`);

    return message.channel.send(new global.Discord.MessageEmbed({
      color: global.guildInstance.config.colors.default,
      title: "QR Code",
      description: text,
      image: { url: response.url },
      footer: { iconURL: message.author.avatarURL(), text: `Requested by ${message.author.tag}` }
    }));
  }
};