module.exports = (sequelize, DataTypes) => {
  return sequelize.define("item", {
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