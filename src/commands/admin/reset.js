module.exports = {
  description: "Reset a members data.",
  permissions: ["ADMINISTRATOR"],
  aliases: ["demolish", "destroy", "obliterate", "disintegrate"],
  parameters: [
    {
      name: "member",
      type: String,
      required: true
    }
  ],
  async execute (client, message) {
    const member = message.mentions.users.first();
    const data = await client.database.members.findByPk(member.id);

    // Reset member data
    await data.destroy();
    await client.database.members.create({ name: member.tag, id: member.id });

    return message.channel.send(`${member.tag}"s data has been reset.`);
  }
};