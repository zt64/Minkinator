module.exports = {
  description: "Toggle a members ability to use Minkinator.",
  parameters: [
    {
      name: "member",
      type: String,
      required: true
    }
  ],
  async execute (client, message, [ member ]) {
    const user = await util.getUser(client, message, member);
    const memberInstance = await global.sequelize.models.user.findByPk(user.id);

    // Toggle state on a member
    const state = memberInstance.botBan ? "unbanned" : "banned";

    // Update member data
    await memberInstance.update({ botBan: !memberInstance.botBan });

    return message.reply(`${user} has been ${state} from using Minkinator.`);
  }
};