module.exports = async (client, guild) => {
  await client.models.createDatabase(client, guild);
  return console.log(`Minkinator has joined ${guild.name} (${guild.id})`);
};