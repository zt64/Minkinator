module.exports = {
  name: 'exec',
  description: 'Executes in terminal.',
  usage: '[input]',
  botOwner: true,
  args: true,
  execute (client, message, args) {
    const execSync = require('child_process').execSync;

    try {
      return message.channel.send(`\`\`\`bash\n${execSync(args.join(' '), { encoding: 'utf-8' })}\n\`\`\``);
    } catch (e) {
      message.channel.send(`\`\`\`bash\n${e}\n\`\`\``);
    }
  }
};
