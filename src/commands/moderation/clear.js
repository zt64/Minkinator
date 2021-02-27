module.exports = {
  description: "Removes a set amount of messages.",
  aliases: ["purge", "sweep"],
  permissions: ["MANAGE_MESSAGES"],
  parameters: [
    {
      name: "count",
      type: Number,
      required: true
    }
  ],
  async execute (client, message, [ count ]) {
    count = parseInt(count);

    // Check if input is valid
    if (isNaN(count) || count < 1) return message.reply("Please enter a number between 1 and 100");

    // Ignore command message
    if (count !== 100) count += 1;

    return message.channel.bulkDelete(Math.round(count));
  }
};