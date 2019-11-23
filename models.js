const Sequelize = require('sequelize');
const { client } = require('./bot.js');

client.on('ready', () => {
  client.guilds.map(guild => {
    const guildName = guild.name;

    const sequelize = new Sequelize('database', 'user', 'password', {
      host: 'localhost',
      dialect: 'sqlite',
      storage: `./databases/${guildName}.sqlite`,
      logging: false
    });

    exports[guildName] = {};

    exports[guildName].sequelize = sequelize;

    exports[guildName].members = sequelize.define('members', {
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

    exports[guildName].variables = sequelize.define('variables', {
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

    console.log(`Created database for ${guildName}`);
  });
});
