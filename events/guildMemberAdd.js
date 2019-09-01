module.exports = async (client, member) => {
  console.log(`${member.tag} has joined the server.`)
  member.guild.send(`${member.tag} has joined the server!`)
}
