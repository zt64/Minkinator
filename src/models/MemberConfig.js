module.exports = (sequelize, DataTypes) => {
  return sequelize.define("memberConfig", {
    measurement: {
      type: DataTypes.STRING,
      defaultValue: "metric"
    },
    levelMention: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
};