exports.create = async (client, guild) => {
  const Sequelize = client.Sequelize;

  const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: `./data/${guild.id}.sqlite`,
    logging: false
  });

  const database = {};

  database.sequelize = sequelize;

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
      allowNull: false,
      defaultValue: 0.00
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    xpTotal: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    xpRequired: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 50
    },
    messages: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    inventory: {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    },
    configuration: {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {
        measurement: 'metric',
        levelMention: true
      }
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

  await sequelize.sync();

  return database;
};

exports.populate = async (client, guild, database) => {
  const databaseMembers = database.members;
  const databaseProperties = database.properties;

  const time = client.moment().format('HH:mm M/D/Y');

  if (databaseMembers) {
    for (const memberData of await databaseMembers.findAll()) {
      try {
        await guild.members.fetch(memberData.id);
      } catch (error) {
        await memberData.destroy();

        console.log(`${`(${time})`.green} Destroyed ${memberData.name}.`);
      }
    };
  }

  // Set guild properties

  await databaseProperties.findOrCreate({ where: { key: 'id' }, defaults: { value: guild.id } });
  await databaseProperties.findOrCreate({ where: { key: 'name' }, defaults: { value: guild.name } });
  await databaseProperties.findOrCreate({ where: { key: 'data' }, defaults: { value: [] } });
  await databaseProperties.findOrCreate({ where: { key: 'items' }, defaults: { value: [] } });
  await databaseProperties.findOrCreate({ where: { key: 'mutes' }, defaults: { value: [] } });
  await databaseProperties.findOrCreate({ where: { key: 'bans' }, defaults: { value: [] } });
  await databaseProperties.findOrCreate({ where: { key: 'coolDowns' }, defaults: { value: [] } });

  await databaseProperties.findOrCreate({
    where: { key: 'configuration' },
    defaults: {
      value: {
        colors: {
          success: '#1ED760',
          error: '#FF0000'
        },
        markov: {
          score: 100,
          tries: 1000
        },
        ignore: [],
        prefix: '!',
        currency: '₼',
        errorTimeout: 5000,
        sellPrice: 0.5,
        redditNSFW: false,
        levelMention: true,
        ignoreBots: true
      }
    }
  });

  return database;
};