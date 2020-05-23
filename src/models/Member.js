module.exports = (sequelize, DataTypes) => {
  return sequelize.define('member', {
    member_id: {
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
    xp_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    xp_required: {
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
    }
  }, {
    timestamps: false
  });
};