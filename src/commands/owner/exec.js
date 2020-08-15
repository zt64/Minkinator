module.exports = {
  description: "Executes a command.",
  parameters: [
    {
      name: "input",
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const defaultColor = guildConfig.colors.default;
    const input = args.join(" ");

    const { exec } = require("child_process");
    const os = client.os;

    const execEmbed = new client.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle(input);

    const execMessage = await message.channel.send(execEmbed);

    // Execute command
    const command = exec(input, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log("Error code: " + error.code);
        console.log("Signal received: " + error.signal);
      }

      if (stdout.length >= 6000) {
        execEmbed.setDescription("Stdout exceeds Discords API embed limit of 6,000 characters.");
      } else {
        if (os.platform() === "linux") {
          execEmbed.setDescription(`\`\`\`sh\n${stdout}\`\`\``);
        } else {
          execEmbed.setDescription(`\`\`\`cmd\n${stdout}\`\`\``);
        }
      }

      execMessage.edit(execEmbed);

      console.log("Child Process STDERR: " + stderr);
    });

    command.on("exit", function (code) {
      console.log("Child process exited with exit code " + code);
    });
  }
};