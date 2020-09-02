module.exports = async (client) => {
  const time = global.moment().format("HH:mm M/D/Y");

  if (!global.fs.existsSync("./data/")) global.fs.mkdirSync("./data/");

  // Create and populate the databases for each guild
  for (const guild of client.guilds.cache.array()) {
    const database = await client.databases.create(client, guild);

    // Populate database
    await client.databases.populate(client, guild, database);

    client.databases[guild.name] = database;

    console.log(`${`(${time})`.green} Initialized database for: ${guild.name} (${guild.id}).`);
  }

  const pluralize = global.pluralize;

  // Set count values
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  // Set activity
  client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });

  return console.log(`${`(${time})`.green} Minkinator is now online.`);
};