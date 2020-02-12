module.exports = async (client) => {
  for (const guild of client.guilds.array()) {
    var database = await client.models.createDatabase(client, guild);

    client.models.populateDatabase(client, guild, database);

    client.models[guild.name] = {};

    client.models[guild.name].sequelize = database.sequelize;
    client.models[guild.name].members = database.members;
    client.models[guild.name].variables = database.variables;

    console.log(`Initialized database for ${guild.name}.`);
  };

  client.user.setActivity(client.config.activity.name, { type: client.config.activity.type });
  // client.user.setActivity(`${client.users.size} users | !help`, { type: 'WATCHING' });

  return console.log('Minkinator is now online.');
};