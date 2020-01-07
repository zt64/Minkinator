module.exports = async (client, message) => {
  await client.guilds.map(async guild => {
    /* if (client.fs.existsSync(`./databases/${guild.name}.sqlite`)) {
      // Import somehow...
    } else {
      return client.models.createDatabase(client, guild);
    } */

    await client.models.createDatabase(client, guild);
  });

  client.user.setActivity(client.config.activityName, { type: client.config.activityType.toUpperCase() });

  return console.log('Minkinator is now online.');
};