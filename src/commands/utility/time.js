const moment = require("moment");

module.exports = {
  description: "Shows the current time.",
  async execute (client, message) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    const utc = moment.utc();

    // Send message
    return message.reply({
      embed: {
        color: colors.default,
        title: "Time / Date",
        fields: [
          { name: "UTC Date:", value: utc.format("dddd, MMMM D, YYYY") },
          { name: "UTC Time:", value: utc.format("kk:mm:ss") },
          { name: "Unix Timestamp:", value: moment().unix() }
        ]
      }
    });
  }
};