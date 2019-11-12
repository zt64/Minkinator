module.exports = async (client, message) => {
  await client.models.sequelize.sync();

  const variables = client.models.variables;
  const members = client.models.members;

  await variables.findOrCreate({ where: { name: 'minkProject' }, defaults: { value: 0 } });
  await variables.findOrCreate({ where: { name: 'prefix' }, defaults: { value: '!' } });

  const [activityName] = await variables.findOrCreate({ where: { name: 'activityName' }, defaults: { value: 'you melt' } });
  const [activityType] = await variables.findOrCreate({ where: { name: 'activityType' }, defaults: { value: 'WATCHING' } });

  await client.users.array().map(async user => {
    if (user.id === 1) return;
    const [member] = await members.findOrCreate({ where: { id: user.id } });
    member.update({ name: user.tag });
  });

  members.findAll().map(async member => {
    if (!client.users.array().map(user => user.id).includes(member.id)) {
      (await members.findByPk(member.id)).destroy();
      console.log(`${member.name} destroyed.`);
    }
  });

  client.user.setActivity(activityName.value, { type: activityType.value.toUpperCase() });

  console.log('Minkinator is now online.');
};
