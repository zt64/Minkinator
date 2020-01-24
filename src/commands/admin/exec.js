module.exports = {
  name: 'exec',
  description: 'Executes in terminal.',
  botOwner: true,
  parameters: [
    {
      name: 'input',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const execSync = require('child_process').execSync;

    try {
      return message.channel.send(new client.discord.MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Execution Result')
        .setDescription(`\`\`\`bash\n${execSync(args.join(' '), { encoding: 'utf-8' })}\n\`\`\``)
      );
    } catch (e) {
      return message.channel.send(new client.discord.MessageEmbed()
        .setColor(client.config.embedError)
        .setTitle('Execution Error')
        .setDescription(`\`\`\`bash\n${e}\n\`\`\``)
      );
    }
  }
};