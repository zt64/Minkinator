module.exports = {
  description: 'Executes a command.',
  parameters: [
    {
      name: 'input',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.colors.success;
    const input = args.join(' ');

    const { exec } = require('child_process');

    const execEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle(input);

    const execMessage = await message.channel.send(execEmbed);

    const command = exec(input, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
      }

      execEmbed.setDescription(`\`\`\`bash\n${stdout}\`\`\``);
      execMessage.edit(execEmbed);

      console.log('Child Process STDERR: ' + stderr);
    });

    command.on('exit', function (code) {
      console.log('Child process exited with exit code ' + code);
    });
  }
};