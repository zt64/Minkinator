module.exports = async (client, guild) => {
  console.log(`Minkinator has left ${guild.name} (${guild.id})`);

  await client.databases[guild.name].sequelize.drop();
  await client.fs.unlinkSync(`./data/${guild.name}.sqlite`);
};