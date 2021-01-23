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
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    const input = args.join(" ");

    const { exec } = require("child_process");

    let description = `> ${input}\n\n`;

    // Helper function to shorten command
    function updateEmbed() {
      if (description.length > 6000) {
        execEmbed.setDescription("```Data exceeds Discord API limit of 6,000 characters.```");
        return execMessage.edit(execEmbed);
      }

      execEmbed.setDescription(`\`\`\`sh\n${description}\`\`\``);
      execMessage.edit(execEmbed);
    }

    const execEmbed = new Discord.MessageEmbed({
      color: colors.default
    });

    const execMessage = await message.channel.send(execEmbed);

    updateEmbed();

    // Execute command
    const command = exec(input);

    // Handle stdout data
    command.stdout.on("data", function (data) {
      description += `${data.toString()}\n`;
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
      description += code === null ? "" : "[status] Return code " + code.toString();
      updateEmbed();
    });
  }
};