module.exports = {
  description: 'Toggle a members ability to use Minkinator.',
  parameters: [
    {
      name: 'member',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const user = await client.functions.getUser(client, message, args[0]);
    const memberData = await client.database.members.findByPk(user.id);

    const state = memberData.botBan ? 'unbanned' : 'banned';

    memberData.update({ botBan: !memberData.botBan });

    return message.channel.send(`${user} has been ${state} from using Minkinator.`);
  }
};