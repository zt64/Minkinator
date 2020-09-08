exports.create = async () => {
  const Sequelize = global.Sequelize;

  const sequelize = new Sequelize("database", "user", "password", {
    host: "localhost",
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
    define: {
      timestamps: false,
      underscored: true
    }
  });

  // Require all models
  const Guild = require("../models/Guild.js")(sequelize, Sequelize);
  const GuildConfig = require("../models/GuildConfig.js")(sequelize, Sequelize);

  const Member = require("../models/Member.js")(sequelize, Sequelize);
  const MemberConfig = require("../models/MemberConfig.js")(sequelize, Sequelize);
  
  const ShopItem = require("../models/ShopItem.js")(sequelize, Sequelize);

  // Guild has one configuration
  Guild.hasOne(GuildConfig);
  GuildConfig.belongsTo(Guild);

  // Guild has many members
  Guild.hasMany(Member);
  Member.belongsTo(Guild);

  // Guild has many shop items
  Guild.hasMany(ShopItem);
  ShopItem.belongsTo(Guild);

  // Member has one configuration
  Member.hasOne(MemberConfig);
  MemberConfig.belongsTo(Member);

  await sequelize.sync();

  return sequelize;
};

exports.populate = async (guild, sequelize) => {
  const models = sequelize.models;

  await models.guild.findOrCreate({ where: { id: guild.id } });
  await models.guildConfig.findOrCreate({ where: { guildId: guild.id }, defaults: { guildId: guild.id }});
};

exports.checkMembers = async (guild, sequelize) => {
  const guildInstance = await sequelize.models.guild.findOne({ where: { id: guild.id }});
  const databaseMembers = guildInstance.getMembers();

  if (databaseMembers) {
    const { chalk, moment } = global;

    const time = moment().format("HH:mm M/D/Y");

    for (const memberData of await databaseMembers.findAll()) {
      try {
        await guild.members.fetch(memberData.id);
      } catch (error) {
        // Delete data for members that no longer exist
        await memberData.destroy();

        console.log(chalk.green(`(${time})`), `Deleted ${memberData.id} from ${guild.name}.`);
      }
    }
  }
};