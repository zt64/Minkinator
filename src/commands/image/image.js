const FormData = require("form-data");

module.exports = {
  description: "Generate an image using DeepAIs text to image generator.",
  parameters: [
    {
      name: "text",
      type: String
    }
  ],
  async execute(client, message, args) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    const form = new FormData();
    const text = args.join(" ");

    form.append("text", text);

    const { output_url } = await util.fetchJSON("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: { "api-key": global.config.auth.deepAI },
      body: form
    });

    return message.reply({
      embed: {
        color: colors.default,
        title: "DeepAI Text to Image",
        description: text,
        image: { url: output_url },
        footer: { iconURL: message.author.avatarURL(), text: `Requested by ${message.author.tag}` }
      }
    });
  }
};
