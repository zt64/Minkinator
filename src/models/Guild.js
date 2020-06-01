module.exports = (sequelize, DataTypes) => {
  return sequelize.define('guild', {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false,
    underscored: true
  });
};