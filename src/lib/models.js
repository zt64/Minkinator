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
  
  const Item = require("../models/Item.js")(sequelize, Sequelize);

  // Setup associations
  Guild.hasOne(GuildConfig);
  Guild.hasMany(Member);
  Guild.hasMany(Item);
  
  Member.hasOne(MemberConfig, { foreignKey: "userId"} );

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
        await memberData.destroy();

        console.log(chalk.green(`(${time})`), `Deleted ${memberData.id} from ${guild.name}.`);
      }
    }
  }
};