module.exports = {
  description: "Reset the guild database.",
  aliases: ["reset-db", "r-db"],
  permissions: ["ADMINISTRATOR"],
  async execute (client, message, args) {
    if (args[0] !== "confirm") return message.channel.send("**Warning**, this command will reset the database for the current guild. To do so add `confirm` as an argument.");
    
    const guildModel = client.database;
    const sequelize = guildModel.sequelize;
    const guild = message.guild;

    await sequelize.sync({ force: true });

    const database = await client.databases.create(client, guild);

    await client.databases.populate(client, guild, database);

    client.databases[guild.name] = database;

    return message.channel.send(`Successfully reset \`${guild.name}\` database.`);
  }
};