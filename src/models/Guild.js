module.exports = (sequelize, DataTypes) => {
  return sequelize.define("guild", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    data: {
      type: DataTypes.TEXT,
      defaultValue: ""
    }
  });
};