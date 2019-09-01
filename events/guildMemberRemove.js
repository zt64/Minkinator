module.exports = async (client, member) => {
  console.log(`${member.tag} has left the server.`)
  member.lastMessage.guild.send(`${member.tag} has left the server.`)
}
