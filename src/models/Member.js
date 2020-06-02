module.exports = (sequelize, DataTypes) => {
  return sequelize.define('member', {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.TEXT
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
    inventory: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    botBan: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: false,
    underscored: true
  });
};