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
        const { colors } = global.guildInstance.config;
        const key = global.auth.steam;

        const json = await global.functions.fetchJSON(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamID}`);

        const [ user ] = json.response.players;
        if (!user) return message.channel.send(`Failed to find a Steam user with the ID of \`${steamID}\`. Make sure that this is a 64 bit ID and try again.`);

        const states = ["Offline", "Online", "Busy", "Away", "Snooze", "Looking to trade", "Looking to play"];

        const embed = new global.Discord.MessageEmbed()
          .setColor(colors.default)
          .setAuthor(user.personaname, user.avatar)
          .setTitle("Steam User Summary")
          .setURL(user.profileurl)
          .addField("Status", states[user.personastate]);

        return message.channel.send(embed);
      }
    }
  ]
};