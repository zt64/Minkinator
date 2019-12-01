module.exports = async (client, message) => {
  client.guilds.map(async guild => {
    const models = client.models[guild.name];

    await models.sequelize.sync();

    const variables = models.variables;
    const members = models.members;

    await variables.findOrCreate({ where: { name: 'minkProject' }, defaults: { value: 0 } });
    await variables.findOrCreate({ where: { name: 'prefix' }, defaults: { value: '!' } });

    for (const member of guild.members.array()) {
      const user = member.user;
      const [memberData] = await members.findOrCreate({ where: { id: user.id } });
  
      memberData.update({ name: user.tag });
    };

    for (const member of await members.findAll()) {
      if (!guild.members.array().map(member => member.user.id).includes(member.id)) {
        (await members.findByPk(member.id)).destroy();
        return console.log(`${member.user.tag} destroyed.`);
      }
    }
  });

  client.user.setActivity(client.config.activityName, { type: client.config.activityType.toUpperCase() });

  console.log('Minkinator is now online.');
};
