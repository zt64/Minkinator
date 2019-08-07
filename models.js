const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
    storage: "database.sqlite",
    logging: false,
});

exports.users = sequelize.define("users", {
    name: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
    },
	id: {
		type: Sequelize.INTEGER,
		unique: true,
	},
	balance: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
    },
    level: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull:false,
    },
    xp: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    messages: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
});

exports.variables = sequelize.define("variables", {
    name: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
    },
    value: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
})

exports.sequelize = sequelize;