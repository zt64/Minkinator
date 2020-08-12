module.exports = (sequelize, DataTypes) => {
  return sequelize.define("guild", {
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
};