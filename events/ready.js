module.exports = async (client, message) => {
  await client.models.sequelize.sync();

  client.user.setPresence({
    game: {
      name: 'over you.',
      type: 'watching'
    },
    status: 'online'
  });

  await client.models.variables.findOrCreate({ where: { name: 'minkProject' }, defaults: { value: 0 } });

  for (var user of await client.users.array()) {
    const [member] = await client.models.members.findOrCreate({ where: { name: user.tag, id: user.id } });
    await member.update({ name: user.tag });
  }

  console.log('Minkinator is now online.');
};
