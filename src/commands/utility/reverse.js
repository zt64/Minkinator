module.exports = {
  description: "Reverses a string.",
  parameters: [
    {
      name: "string",
      type: String,
      required: true
    }
  ],
  async execute (client, message, string) {
    const reversedText = string.join(" ").split("").reverse().join("");

    return message.reply({ embed: {
      color: global.config.colors.default,
      title: "Reversed Text",
      description: reversedText
    } });
  }
};