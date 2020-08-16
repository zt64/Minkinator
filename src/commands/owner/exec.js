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

    let description = "";
  
    const execEmbed = new client.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle(input);

    const execMessage = await message.channel.send(execEmbed);

    // Execute command
    const command = exec(input);

    // Handle stdout data
    command.stdout.on("data", function (data) {
      description += `[stdout] ${data.toString()}\n`;
      updateEmbed();
    });

    // Handle stderr data
    command.stderr.on("data", function (data) {
      description += `[stderr] ${data.toString()}\n`;
      updateEmbed();
    });

    // Handle error data
    command.on("error", function (data) {
      description += `[error] ${data.toString()}\n`;
      updateEmbed();
    });

    // Handle exit code
    command.on("exit", function (code) {
      description += "[status] Return code " + code.toString();
      updateEmbed();
    });

    // Helper function to shorten command
    function updateEmbed() {
      execEmbed.setDescription(`\`\`\`sh\n${description}\`\`\``);
      execMessage.edit(execEmbed);
    }
  }
};