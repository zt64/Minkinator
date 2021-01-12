const FormData = require("form-data");
const fetch = require("node-fetch");

module.exports = {
  description: "Generate an image using DeepAIs text to image generator.",
  parameters: [
    {
      name: "text",
      type: String
    }
  ],
  async execute(client, message, args) {
    const form = new FormData();
    const text = args.join(" ");

    form.append("text", text);

    const { output_url } = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: { "api-key": global.auth.deepAI },
      body: form
    }).then(res => res.json());

    return message.channel.send(new Discord.MessageEmbed({
      color: global.guildInstance.config.colors.default,
      title: "DeepAI Text to Image",
      description: text,
      image: { url: output_url },
      footer: { iconURL: message.author.avatarURL(), text: `Requested by ${message.author.tag}` }
    }));
  }
};
