module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      unique: true
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    botBan: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};