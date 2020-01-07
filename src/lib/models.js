exports.createDatabase = async function createDatabase (client, guild) {
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
  await variables.findOrCreate({ where: { name: 'minkProject' }, defaults: { value: 0 } });
  await variables.findOrCreate({ where: { name: 'errorTimeout' }, defaults: { value: 3000 } });
  await variables.findOrCreate({
    where: { name: 'items' },
    defaults: {
      value: [
        {
          name: 'gold',
          price: 40
        },
        {
          name: 'bread',
          price: 5
        }
      ]
    }
  });

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

  return console.log(`Created database for ${guildName}`);
};