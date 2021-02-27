module.exports = {
  description: "Displays information regarding Minkinator.",
  async execute (client, message) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    const owner = await client.users.fetch(global.config.ownerID);

    // Send embed
    return message.reply({
      embed: {
        color: colors.default,
        title: "Minkinator Information",
        description: "The name Minkinator comes from my cats name, Minky, who is also the cat in the bots avatar. The purpose of this bot was originally a coding playground for me, but now its more focused on the end users. If you ever find a bug or have a feature request, please do so on the GitHub repository below.",
        thumbnail: { url: client.user.displayAvatarURL() },
        fields: [
          { name: "Github", value: "https://github.com/Litleck/Minkinator" },
          { name: "Patreon", value: "https://www.patreon.com/minkinator" },
          { name: "Official Discord Server", value: "https://discord.gg/AEZFFfA" }
        ],
        footer: { iconURL: owner.displayAvatarURL(), text: `Created by Litleck (${owner.tag})` }
      }
    });
  }
};