module.exports = async(client, message) => {
    await client.models.sequelize.sync();
    
    client.user.setPresence({
        game: { 
            name: "over you.",
            type: "watching"
        },
        status: "idle"
    })

    await client.models.variables.findOrCreate({where: { name: "minkProject" }, defaults: { value: 0}});

    for (var user of await client.users.array()) {
        const [_user] = await client.models.users.findOrCreate({where: { name: user.tag, id: user.id }, defaults: {}})
        await _user.update({ name: user.tag });
    }
    
    console.log("Minkinator is now online.");
}