module.exports = (sequelize, DataTypes) => {
  return sequelize.define("userConfig", {
    userId: {
      type: DataTypes.TEXT,
      primaryKey: true,
      unique: true
    },
    measurement: {
      type: DataTypes.STRING,
      defaultValue: "metric"
    }
  });
};