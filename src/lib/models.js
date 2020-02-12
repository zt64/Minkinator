exports.createDatabase = async (client, guild) => {
  const Sequelize = client.Sequelize;
  const guildName = guild.name;

  const database = {};

  const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: `./data/${guildName}.sqlite`,
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
      type: Sequelize.FLOAT,
      defaultValue: 0.00,
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

  database.sequelize = sequelize;
  database.members = members;
  database.variables = variables;

  await sequelize.sync();

  return database;
};

exports.populateDatabase = async (client, guild, database) => {
  const databaseMembers = database.members;
  const variables = database.variables;

  for (const guildMember of guild.members.array()) {
    const user = guildMember.user;
    const [memberData] = await databaseMembers.findOrCreate({ where: { id: user.id } });

    await memberData.update({ name: user.tag });
  };

  for (const memberData of await databaseMembers.findAll()) {
    try {
      await guild.members.fetch(memberData.id);
    } catch (e) {
      memberData.destroy();

      console.log(`${memberData.name} destroyed.`);
    }
  };

  await variables.findOrCreate({ where: { name: 'prefix' }, defaults: { value: '!' } });
  await variables.findOrCreate({ where: { name: 'currency' }, defaults: { value: '₼' } });
  await variables.findOrCreate({ where: { name: 'errorTimeout' }, defaults: { value: 3000 } });
  await variables.findOrCreate({
    where: { name: 'items' },
    defaults: {
      value: JSON.parse(client.fs.readFileSync('./config/items.json'))
    }
  });
};

exports.destroyDatabase = (database) => {

};