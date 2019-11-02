const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false
});

exports.members = sequelize.define('members', {
  id: {
    type: Sequelize.TEXT,
    primaryKey: true,
    unique: true
  },
  name: {
    type: Sequelize.TEXT
  },
  balance: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  level: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  xp: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  messages: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  timestamps: false
});

exports.variables = sequelize.define('variables', {
  name: {
    type: Sequelize.TEXT,
    primaryKey: true
  },
  value: {
    type: Sequelize.TEXT,
    defaultValue: 0,
    allowNull: false
  }
}, {
  timestamps: false
});

exports.sequelize = sequelize;
