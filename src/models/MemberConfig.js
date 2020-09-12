module.exports = (sequelize, DataTypes) => {
  return sequelize.define("memberConfig", {
    userId: {
      type: DataTypes.TEXT,
      primaryKey: true,
      unique: true
    },
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