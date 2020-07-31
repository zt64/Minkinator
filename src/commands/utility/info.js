module.exports = {
  description: "Displays information regarding Minkinator.",
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;
    const owner = await client.users.fetch(client.config.ownerID);

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setTitle("Minkinator Information")
      .setDescription("What is a Minkinator you may ask. Well, I'm not quite sure myself. On the 22nd of August, 2019, I just decided to try and make a Discord bot on my phone. Soon Minkinator would be hosted on my desktop computer and currently is hosted on my own Raspberry Pi. I never had any idea that Minkinator would reach this far. If you ever find a bug or have a feature request, please do so on the GitHub repository below.")
      .addField("Commands:", client.commands.size, true)
      .addField("Events:", client.events.size, true)
      .addField("GitHub:", "https://github.com/Litleck/Minkinator")
      .addField("Patreon:", "https://www.patreon.com/minkinator")
      .setFooter(`Created by Litleck (${owner.tag})`, owner.displayAvatarURL())
    );
  }
};