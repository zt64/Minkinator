exports.create = async (client, guild) => {
  const Sequelize = client.Sequelize;

  const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: `./data/${guild.id}.sqlite`,
    logging: false
  });

  const database = {};

  // Define database members

  database.members = sequelize.define('members', {
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
    xpRequired: {
      type: Sequelize.INTEGER,
      defaultValue: 50,
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
    },
    configuration: {
      type: Sequelize.JSON,
      defaultValue: [],
      allowNull: false
    }
  }, {
    timestamps: false
  });

  // Define database properties

  database.properties = sequelize.define('properties', {
    key: {
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

  await sequelize.sync();

  return database;
};

exports.populate = async (client, guild, database) => {
  const databaseMembers = database.members;
  const databaseProperties = database.properties;

  // Create model if it doesn't exist

  for (const guildMember of guild.members.cache.array()) {
    const user = guildMember.user;
    const [memberData] = await databaseMembers.findOrCreate({ where: { id: user.id } });

    memberData.configuration = {
      levelMention: true
    };

    await memberData.update({ name: user.tag, configuration: memberData.configuration });
  };

  // Destroy model if the member left

  for (const memberData of await databaseMembers.findAll()) {
    try {
      await guild.members.fetch(memberData.id);
    } catch (e) {
      memberData.destroy();

      console.log(`${memberData.name} destroyed.`);
    }
  };

  // Set guild properties

  await databaseProperties.findOrCreate({ where: { key: 'id' }, defaults: { value: guild.id } });
  await databaseProperties.findOrCreate({ where: { key: 'name' }, defaults: { value: guild.name } });
  await databaseProperties.findOrCreate({ where: { key: 'data' }, defaults: { value: [] } });

  await databaseProperties.findOrCreate({
    where: { key: 'items' },
    defaults: {
      value: JSON.parse(client.fs.readFileSync('./config/items.json'))
    }
  });

  await databaseProperties.findOrCreate({
    where: { key: 'configuration' },
    defaults: {
      value: {
        prefix: '!',
        currency: '₼',
        embedColor: '#1ED760',
        errorTimeout: 3000,
        redditNSFW: false,
        levelMention: true,
        ignoreBots: true
      }
    }
  });

  return database;
};

exports.destroyDatabase = (database) => {

};