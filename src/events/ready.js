module.exports = async (client, message) => {
  await client.guilds.map(guild => client.models.createDatabase(client, guild));

  client.user.setActivity(client.config.activityName, { type: client.config.activityType.toUpperCase() });

  return console.log('Minkinator is now online.');
};