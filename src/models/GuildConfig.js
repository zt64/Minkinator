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
    },
    sellPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0.5
    },
    redditNSFW: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    levelMention: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ignoreBots: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ignore: {
      type: DataTypes.JSON,
      defaultValue: [ "?" ]
    },
    colors: {
      type: DataTypes.JSON,
      defaultValue: {
        default: "#1ED760",
        error: "#FF0000"
      }
    }
  });
};