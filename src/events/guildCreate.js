module.exports = async (client, guild) => {
  await client.databases.create(client, guild);
  return console.log(`Minkinator has joined ${guild.name} (${guild.id})`);
};