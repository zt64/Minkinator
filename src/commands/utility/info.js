module.exports = {
  description: "Displays information regarding Minkinator.",
  async execute (client, message) {
    const { colors } = global.guildInstance.config;
    const owner = await client.users.fetch(global.config.ownerID);

    // Send embed
    return message.channel.send(new global.Discord.MessageEmbed({
      color: colors.default,
      title: "Minkinator Information",
      description: "What is a Minkinator you may ask. Well, I'm not quite sure myself. On the 22nd of August, 2019, I just decided to try and make a Discord bot on my phone. Soon Minkinator would be hosted on my desktop computer and currently is hosted on my own Raspberry Pi. I never had any idea that Minkinator would reach this far. If you ever find a bug or have a feature request, please do so on the GitHub repository below.",
      thumbnail: { url: client.user.displayAvatarURL() },
      fields: [
        { name: "Github", value: "https://github.com/Litleck/Minkinator" },
        { name: "Patreon", value: "https://www.patreon.com/minkinator" },
        { name: "Official Discord Server", value: "https://discord.gg/AEZFFfA" }
      ],
      footer: { text: `Created by Litleck (${owner.tag})`, iconURL: owner.displayAvatarURL() }
    }));
  }
};