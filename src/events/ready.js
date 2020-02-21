module.exports = async (client) => {
  for (const guild of client.guilds.cache.array()) {
    const database = await client.databases.create(client, guild);

    await client.databases.populate(client, guild, database);

    client.databases[guild.name] = database;

    console.log(`Initialized database for ${guild.name} (${guild.id}).`);
  };

  client.user.setActivity(client.config.activity.name, { type: client.config.activity.type });

  // client.user.setActivity(`${client.users.size} users | !help`, { type: 'WATCHING' });

  return console.log('Minkinator is now online.');
};