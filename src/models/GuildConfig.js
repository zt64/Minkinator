module.exports = (sequelize, DataTypes) => {
  return sequelize.define("guildConfig", {
    guildId: {
      type: DataTypes.TEXT,
      primaryKey: true,
      unique: true
    },
    prefix: {
      type: DataTypes.CHAR,
      defaultValue: global.config.prefix
    },
    currency: {
      type: DataTypes.CHAR,
      defaultValue: "₼"
    },
    errorTimeout: {
      type: DataTypes.INTEGER,
      defaultValue: 5000
    }
  });
};