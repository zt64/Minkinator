module.exports = {
  name: 'invite',
  description: 'Generates an invitation link for Minkinator',
  async execute (client, message, args) {
    return message.channel.send(await client.generateInvite(['ADMINISTRATOR']));
  }
};
