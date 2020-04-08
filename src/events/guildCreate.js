module.exports = async (client, guild) => {
  const time = client.moment().format('HH:mm M/D/Y');
  await client.databases.create(client, guild);

  return console.log(`${`(${time})`.green} Minkinator has joined: ${guild.name} (${guild.id})`);
};