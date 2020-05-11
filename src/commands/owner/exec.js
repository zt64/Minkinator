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
    const successColor = guildConfig.embedColors.success;
    const input = args.join(' ');

    const { exec } = require('child_process');

    const ls = exec(input, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
      }
      console.log('Child Process STDOUT: ' + stdout);
      console.log('Child Process STDERR: ' + stderr);
    });

    ls.on('exit', function (code) {
      console.log('Child process exited with exit code ' + code);
    });

    const execEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle('Exec')
      .setDescription(`\`\`\`bash\n${input}\`\`\``);

    const execMessage = await message.channel.send(execEmbed);

    const command = exec(input);

    for await (const data of command.stdout) {
      execEmbed.description += data.toString();
      execMessage.edit(execEmbed);
    };
  }
};