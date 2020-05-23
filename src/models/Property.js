module.exports = (sequelize, DataTypes) => {
  return sequelize.define('property', {
    key: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    value: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: false
  });
};