module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user_item", {
    userId: DataTypes.STRING,
    itemId: DataTypes.STRING,
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0
    }
  }, {
    timestamps: false,
    underscored: true
  });
};