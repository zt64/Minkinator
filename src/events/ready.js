module.exports = async (client) => {
  const time = client.moment().format("HH:mm M/D/Y");

  if (!client.fs.existsSync("./data/")) client.fs.mkdirSync("./data/");

  // Create and populate the databases for each guild
  for (const guild of client.guilds.cache.array()) {
    const database = await client.databases.create(client, guild);

    await client.databases.populate(client, guild, database);

    client.databases[guild.name] = database;

    const data = await database.properties.findByPk("data").then(key => key.value);

    // Build markov corpus
    if (data.length > 0) {
      const markov = new client.Markov(data, { stateSize: 2 });

      markov.buildCorpus();

      client.databases[guild.name].markov = markov;
    }

    console.log(`${`(${time})`.green} Initialized database for: ${guild.name} (${guild.id}).`);
  };

  // Set the bot activity
  const pluralize = client.pluralize;

  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });

  return console.log(`${`(${time})`.green} Minkinator is now online.`);
};