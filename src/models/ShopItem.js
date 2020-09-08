module.exports = (sequelize, DataTypes) => {
  return sequelize.define("shopItem", {
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });
};