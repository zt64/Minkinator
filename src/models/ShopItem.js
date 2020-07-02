module.exports = (sequelize, DataTypes) => {
  return sequelize.define("shop_item", {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false,
    underscored: true
  });
};