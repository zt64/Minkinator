module.exports = async(client, message) => {
    await client.models.sequelize.sync();
	
	client.user.setPresence({
        game: { 
            name: "over you.",
            type: "watching"
        },
        status: "idle"
	})

	if (await !client.models.variables.findByPk("minkProject")) {
		await client.models.variables.create({
			name: "minkProject",
			value: 0,
		})
	}

	for (var user of await client.users.array()) {
        if (!await client.models.users.findByPk(user.id)) {
			await client.models.users.create({
				name: user.tag,
				id: user.id,
				balance: 0,
			});
			console.log(`User ${user.tag} added.`)
		}
		await client.models.users.update({ name: user.tag }, { where: { id: user.id}});
	}
	
	console.log("Minkinator is now online.");
}