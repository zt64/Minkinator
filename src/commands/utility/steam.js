module.exports = {
  description: "Curious about a user or game? Check out information on them with this command.",
  subCommands: [
    {
      name: "user",
      description: "Fetch information on a steam user.",
      parameters: [
        {
          name: "steamID64",
          type: Number,
          required: true
        }
      ],
      async execute (client, message, [ steamID ]) {
        const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
        const key = global.config.auth.steam;

        const json = await util.fetchJSON(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamID}`);

        const [ user ] = json.response.players;
        if (!user) return message.reply(`Failed to find a Steam user with the ID of \`${steamID}\`. Make sure that this is a 64 bit ID and try again.`);

        const states = ["Offline", "Online", "Busy", "Away", "Snooze", "Looking to trade", "Looking to play"];

        return message.reply({
          embed: {
            color: colors.default,
            author: { iconURL: user.avatar, name: user.personaname },
            title: "Steam User Summary",
            url: user.profile.url,
            fields: [
              { name: "Status", value: states[user.personastate] }
            ]
          }
        });
      }
    }
  ]
};