module.exports = (sequelize, DataTypes) => {
  return sequelize.define("guild", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    corpus: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    commands: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  });
};