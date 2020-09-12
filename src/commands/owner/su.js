module.exports = {
  description: "Execute a command as another member.",
  parameters: [
    {
      name: "id",
      type: Number,
      required: true
    },
    {
      name: "command",
      type: String,
      required: true
    },
    {
      name: "parameters"
    }
  ],
  async execute (client, message, args) {
    const userID = args[0];
    const commandName = args[1];
    const commandArgs = args.splice(2);

    message.author = await client.users.fetch(userID);

    const command = client.commands.get(commandName) || [...client.commands.values()].find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    const guildInstance = global.guildInstance = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true, nested: true } });

    let memberInstance = await global.sequelize.models.member.findByPk(message.author.id, { include: { all: true, nested: true } });
    if (!memberInstance) memberInstance = await guildInstance.createMember({ userId: message.author.id, guildId: message.guild.id });

    global.memberInstance = memberInstance;

    return command.execute(client, message, commandArgs);
  }
};
