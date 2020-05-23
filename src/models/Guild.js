module.exports = (sequelize, DataTypes) => {
  return sequelize.define('guild', {
    name: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    timestamps: false,
    underscored: true
  });
};