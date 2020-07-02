exports.create = async (client, guild) => {
  const Sequelize = client.Sequelize;

  const sequelize = new Sequelize("database", "user", "password", {
    host: "localhost",
    dialect: "sqlite",
    storage: `./data/${guild.id}.sqlite`,
    logging: false
  });

  const database = {};

  // Import models

  const Guild = sequelize.import("../models/Guild.js");
  const Property = sequelize.import("../models/Property.js");
  const Member = sequelize.import("../models/Member.js");
  const ShopItem = sequelize.import("../models/ShopItem.js");
  const UserItem = sequelize.import("../models/UserItem.js");

  // Setup relations

  Guild.hasMany(Member);
  Guild.hasMany(ShopItem);
  Guild.hasMany(Property);

  Member.hasMany(UserItem);

  await sequelize.sync();

  await Guild.findOrCreate({
    where: { id: guild.id },
    defaults: {
      id: guild.id,
      name: guild.name
    }
  });

  // Link to the database

  database.sequelize = sequelize;
  database.guilds = Guild;
  database.members = Member;
  database.properties = Property;

  return database;
};

exports.populate = async (client, guild, database) => {
  const databaseMembers = database.members;
  const databaseProperties = database.properties;

  const time = client.moment().format("HH:mm M/D/Y");

  if (databaseMembers) {
    for (const memberData of await databaseMembers.findAll()) {
      try {
        await guild.members.fetch(memberData.id);
      } catch (error) {
        await memberData.destroy();

        console.log(`${`(${time})`.green} Deleted ${memberData.name} from ${guild.name}.`);
      }
    };
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
          success: "#1ED760",
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