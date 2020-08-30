exports.create = async (client, guild) => {
  const Sequelize = global.Sequelize;
  const DataTypes = Sequelize.DataTypes;

  const sequelize = new Sequelize("database", "user", "password", {
    host: "localhost",
    dialect: "sqlite",
    storage: `./data/${guild.id}.sqlite`,
    logging: false
  });

  const Guild = sequelize.define("guild", {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING
    },
    configuration: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        colors: {
          default: "#1ED760",
          error: "#FF0000"
        },
        markov: {
          score: 100,
          tries: 1000,
          mention: true
        },
        ignore: [],
        prefix: "!",
        currency: "₼",
        errorTimeout: 5000,
        sellPrice: 0.5,
        redditNSFW: false,
        levelMention: true,
        ignoreBots: true
      }
    }
  }, {
    timestamps: false,
    underscored: true
  });

  const Member = sequelize.define("member", {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      unique: true
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    xpTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    xpRequired: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50
    },
    messages: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    botBan: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    configuration: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        measurement: "metric",
        levelMention: true
      }
    },
    inventory: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    }
  }, {
    timestamps: false,
    underscored: true
  });

  const Property = sequelize.define("property", {
    key: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    value: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    timestamps: false,
    underscored: true
  });

  await sequelize.sync();

  await Guild.findOrCreate({
    where: { id: guild.id },
    defaults: {
      id: guild.id,
      name: guild.name
    }
  });

  // Link to the database
  const database = {};

  database.sequelize = sequelize;
  database.guilds = Guild;
  database.members = Member;
  database.properties = Property;

  return database;
};

exports.populate = async (client, guild, database) => {
  const databaseMembers = database.members;
  const databaseProperties = database.properties;

  const time = global.Moment().format("HH:mm M/D/Y");

  if (databaseMembers) {
    for (const memberData of await databaseMembers.findAll()) {
      try {
        await guild.members.fetch(memberData.id);
      } catch (error) {
        // Delete data for members that no longer exist
        await memberData.destroy();

        console.log(`${`(${time})`.green} Deleted ${memberData.id} from ${guild.name}.`);
      }
    }
  }

  // Set guild properties
  await databaseProperties.findOrCreate({ where: { key: "id" }, defaults: { value: guild.id } });
  await databaseProperties.findOrCreate({ where: { key: "name" }, defaults: { value: guild.name } });
  await databaseProperties.findOrCreate({ where: { key: "data" }, defaults: { value: [] } });
  await databaseProperties.findOrCreate({ where: { key: "items" }, defaults: { value: [] } });
  await databaseProperties.findOrCreate({ where: { key: "commands" }, defaults: { value: [] } });
  await databaseProperties.findOrCreate({ where: { key: "mutes" }, defaults: { value: [] } });
  await databaseProperties.findOrCreate({ where: { key: "bans" }, defaults: { value: [] } });
  await databaseProperties.findOrCreate({ where: { key: "coolDowns" }, defaults: { value: [] } });

  await databaseProperties.findOrCreate({
    where: { key: "configuration" },
    defaults: {
      value: {
        colors: {
          default: "#1ED760",
          error: "#FF0000"
        },
        markov: {
          score: 100,
          tries: 1000,
          mention: true
        },
        ignore: [],
        prefix: "!",
        currency: "₼",
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