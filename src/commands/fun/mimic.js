module.exports = {
  description: 'Mimic another member in the guild.',
  parameters: [
    {
      name: 'member',
      type: String
    }
  ],
  async execute (client, message, args) {
    const user = message.author.id || message.mentions.users.first();
    const memberData = client.model.members.findByPk(user.id);

    const configuration = memberData.configuration;

    if (configuration.mimic) configuration.mimic = false;
    if (!configuration.mimic) configuration.mimic = true;

    memberData.update({ configuration: configuration})
  }
}