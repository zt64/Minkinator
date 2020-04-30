module.exports = async (client, guild) => {
  const time = client.moment().format('HH:mm M/D/Y');

  const database = await client.databases.create(client, guild);
  await client.databases.populate(client, guild, database);

  return console.log(`${`(${time})`.green} Minkinator has joined: ${guild.name} (${guild.id})`);
};