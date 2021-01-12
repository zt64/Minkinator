const moment = require("moment");

module.exports = {
  description: "Shows the current time.",
  async execute (client, message) {
    const utc = moment.utc();

    // Create embed
    const timeEmbed = new Discord.MessageEmbed({
      color: global.guildInstance.config.colors.default,
      title: "Time / Date",
      fields: [
        { name: "UTC Date:", value: utc.format("dddd, MMMM D, YYYY") },
        { name: "UTC Time:", value: utc.format("kk:mm:ss") },
        { name: "Unix Timestamp:", value: moment().unix() }
      ]
    });

    return message.channel.send(timeEmbed);
  }
};