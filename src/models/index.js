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

  const User = require("./User.js")(sequelize, Sequelize);
  const UserConfig = require("./UserConfig.js")(sequelize, Sequelize);

  const Command = require("./Command.js")(sequelize, Sequelize);

  // Set up associations
  Guild.hasOne(GuildConfig, { as: "config", foreignKey: "guildId" });
  User.hasOne(UserConfig, { as: "config", foreignKey: "userId" } );

  Guild.hasMany(Command, { as: "commands" });

  await sequelize.sync();

  return sequelize;
};

exports.initialize = async (sequelize, guild) => {
  const guildInstance = await sequelize.models.guild.findOrCreate({ where: { id: guild.id } });
  await sequelize.models.guildConfig.findOrCreate({ where: { guildId: guild.id } });

  return guildInstance;
};