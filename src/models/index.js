const Sequelize = require("sequelize");

exports.create = async () => {
  const sequelize = new Sequelize("database", "user", "password", {
    host: "localhost",
    dialect: "sqlite",
    storage: `${__basedir}/database.sqlite`,
    logging: false,
    define: {
      timestamps: false,
      underscored: true
    }
  });

  // Require all models
  const Guild = require("./Guild.js")(sequelize, Sequelize);
  const GuildConfig = require("./GuildConfig.js")(sequelize, Sequelize);

  const Member = require("./Member.js")(sequelize, Sequelize);
  const MemberConfig = require("./MemberConfig.js")(sequelize, Sequelize);
  
  const Item = require("./Item.js")(sequelize, Sequelize);

  // Set up associations
  Guild.hasOne(GuildConfig, { as: "config", foreignKey: "guildId" });
  Member.hasOne(MemberConfig, { as: "config", foreignKey: "userId" } );

  Guild.hasMany(Member);
  Guild.hasMany(Item);

  await sequelize.sync();

  return sequelize;
};

exports.initialize = async (guild) => {
  const { models } = global.sequelize;

  const guildInstance = await models.guild.findOrCreate({ where: { id: guild.id } });
  await models.guildConfig.findOrCreate({ where: { guildId: guild.id } });

  return guildInstance;
};

exports.checkMembers = async (guild, guildInstance) => {
  const chalk = require("chalk");

  const databaseMembers = guildInstance.getMembers();

  if (!databaseMembers) return;

  for (const memberData of await databaseMembers.findAll()) {
    try {
      await guild.members.fetch(memberData.id);
    } catch (error) {
      await memberData.destroy();

      console.log(chalk.green(`(${util.time()})`), `Deleted ${memberData.id} from ${guild.name}.`);
    }
  }
};