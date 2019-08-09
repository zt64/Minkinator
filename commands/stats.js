const Discord = require("discord.js");
const { users } = require("../models.js");
const { currency } = require("../config.json");

module.exports = {
    name: "stats",
    description: "Displays a users statistics.",
    aliases: ["statistics", "info", "information"],
    usage: "<user>",
    async execute(message, args) {
        if (args[0]) {
            user = await users.findOne({ where: { id: message.mentions.members.first().id} });
            member = message.mentions.users.first();
        } else {
            user = await users.findOne({ where: { id: message.author.id} });
            member = message.author;
        }
        
        const embed = new Discord.RichEmbed() 
            .setColor(`#34eb3d`)
            .setTitle(`Statistics for @${user.name}`)
            .setThumbnail(member.displayAvatarURL)
            .addField(`Balance`, `${currency}${user.balance}`)
            .addField(`Level`, `${user.level}`)
            .addField(`Total experience`, `${user.xp} XP`)
            .addField(`Total messages`, `${user.messages}` )
            .setTimestamp()
            .setFooter(`${user.name}`)
            
        message.channel.send(embed);
    }
}
