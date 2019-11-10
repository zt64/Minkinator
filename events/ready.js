module.exports = async (client, message) => {
  await client.models.sequelize.sync();

  const variables = client.models.variables;
  const members = client.models.members;

  await variables.findOrCreate({ where: { name: 'minkProject' }, defaults: { value: 0 } });
  await variables.findOrCreate({ where: { name: 'prefix' }, defaults: { value: '!' } });

  await variables.findOrCreate({ where: { name: 'presenceType' }, defaults: { value: 'Watching' } });
  await variables.findOrCreate({ where: { name: 'presenceName' }, defaults: { value: 'you sleep' } });

  await client.users.array().map(async user => {
    if (user.id === 1) return;
    const [member] = await members.findOrCreate({ where: { id: user.id } });
    member.update({ name: user.tag });
  });

  members.findAll().map(async member => {
    if (!client.users.array().map(user => user.id).includes(member.id)) {
      console.log(`${member.name} destroyed.`);
      (await members.findByPk(member.id)).destroy();
    }
  });

  client.user.setPresence({
    game: {
      type: (await variables.findByPk('presenceType')).value,
      name: (await variables.findByPk('presenceName')).value
    }
  });

  console.log('Minkinator is now online.');
};
