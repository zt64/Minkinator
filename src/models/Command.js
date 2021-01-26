module.exports = (sequelize, DataTypes) => {
  return sequelize.define("command", {
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    config: {
      type: DataTypes.JSON,
      defaultValue: {
        enabled: true
      }
    }
  });
};