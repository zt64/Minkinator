module.exports = async (client, message) => {
  await client.models.sequelize.sync()

  client.user.setPresence({
    game: {
      name: 'over you.',
      type: 'watching'
    },
    status: 'idle'
  })

  await client.models.variables.findOrCreate({ where: { name: 'minkProject' }, defaults: { value: 0 } })

  for (var member of await client.users.array()) {
    const [_user] = await client.models.users.findOrCreate({ where: { name: member.tag, id: member.id } })
    await _user.update({ name: member.tag })
  }

  console.log('Minkinator is now online.')
  client.channels.get('602540542294753293').send('I have been summoned.')
}
