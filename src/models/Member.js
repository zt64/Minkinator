module.exports = (sequelize, DataTypes) => {
  return sequelize.define("member", {
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
};