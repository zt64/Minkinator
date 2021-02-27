module.exports = {
  description: "Generates an invitation link for Minkinator",
  async execute (client, message) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    // Generate URL for invite
    const inviteURL = await client.generateInvite({ permissions: ["ADMINISTRATOR"] });

    return message.reply({
      embed: {
        color: colors.default,
        title: "Invite Minkinator to any server",
        description: `Click on the title URL and you can add Minkinator to other servers. This does require administrator rights in the server to be added. \n\n ${inviteURL}`,
        url: inviteURL
      }
    });
  }
};