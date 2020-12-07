module.exports = {
  description: "Toggle a members ability to use Minkinator.",
  parameters: [
    {
      name: "member",
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const user = await util.getUser(client, message, args[0]);
    const memberData = global.memberInstance;

    // Toggle state on a member
    const state = memberData.botBan ? "unbanned" : "banned";

    // Update member data
    memberData.update({ botBan: !memberData.botBan });

    return message.channel.send(`${user} has been ${state} from using Minkinator.`);
  }
};