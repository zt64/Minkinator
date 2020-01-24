exports.createDatabase = async (client, guild) => {
  const Sequelize = client.Sequelize;
  const guildName = guild.name;

  const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: `./databases/${guildName}.sqlite`,
    logging: false
  });

  const members = sequelize.define('members', {
    id: {
      type: Sequelize.TEXT,
      primaryKey: true,
      unique: true
    },
    name: {
      type: Sequelize.TEXT
    },
    balance: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    xp: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    messages: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    inventory: {
      type: Sequelize.JSON,
      defaultValue: [],
      allowNull: false
    }
  }, {
    timestamps: false
  });

  const variables = sequelize.define('variables', {
    name: {
      type: Sequelize.TEXT,
      primaryKey: true
    },
    value: {
      type: Sequelize.JSON,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  exports[guildName] = {};

  exports[guildName].sequelize = sequelize;
  exports[guildName].members = members;
  exports[guildName].variables = variables;

  await sequelize.sync();

  await variables.findOrCreate({ where: { name: 'prefix' }, defaults: { value: '!' } });
  await variables.findOrCreate({ where: { name: 'currency' }, defaults: { value: '₼' } });
  await variables.findOrCreate({ where: { name: 'errorTimeout' }, defaults: { value: 3000 } });
  await variables.findOrCreate({
    where: { name: 'items' },
    defaults: {
      value: [
        {
          name: 'gold',
          price: 260
        },
        {
          name: 'bread',
          price: 30
        },
        {
          name: 'souls',
          price: 666
        }
      ]
    }
  });

  for (const guildMember of guild.members.array()) {
    const user = guildMember.user;
    const [memberData] = await members.findOrCreate({ where: { id: user.id } });

    memberData.update({ name: user.tag });
  };

  for (const memberData of await members.findAll()) {
    try {
      await guild.members.fetch(memberData.id);
    } catch (e) {
      memberData.destroy();
      console.log(`${memberData.name} destroyed.`);
    }
  };

  return console.log(`Created database for ${guildName}`);
};

exports.destroyDatabase = (database) => {

};