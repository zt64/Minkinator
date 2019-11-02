module.exports = async (client, message) => {
  await client.models.sequelize.sync();

  const variables = await client.models.variables;

  await variables.findOrCreate({ where: { name: 'minkProject' }, defaults: { value: 0 } });
  await variables.findOrCreate({ where: { name: 'prefix' }, defaults: { value: '!' } });

  await variables.findOrCreate({ where: { name: 'presenceType' }, defaults: { value: 'Watching' } });
  await variables.findOrCreate({ where: { name: 'presenceName' }, defaults: { value: 'you sleep' } });

  for (var user of await client.users.array()) {
    if (user.id === 1) return;
    const [member] = await client.models.members.findOrCreate({ where: { id: user.id } });
    await member.update({ name: user.tag });
  }

  client.user.setPresence({
    game: {
      type: (await client.models.variables.findByPk('presenceType')).value,
      name: (await client.models.variables.findByPk('presenceName')).value
    }
  });

  console.log('Minkinator is now online.');
};
