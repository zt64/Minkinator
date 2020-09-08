module.exports = async (client, message) => {
  // Return if in a DM channel
  if (message.channel.type === "dm") {
    if (message.author.bot) return;

    return message.channel.send("Commands cannot be run inside DMs.");
  }

  // Set constants
  const { formatNumber, sleep } = global.functions;

  const guildInstance = await global.sequelize.models.guild.findOne({
    where: {
      id: message.guild.id
    },
    include: { all: true, nested: true }
  });

  global.guildInstance = guildInstance;

  // Set guild constants
  const guildConfig = guildInstance.guildConfig;

  const { errorTimeout, currency, prefix, ignore, colors } = guildConfig;

  // Return if ignoreBots is true and author is bot
  if (guildConfig.ignoreBots && message.author.bot) return;

  let memberInstance = await global.sequelize.models.member.findByPk(message.author.id);

  if (!memberInstance) memberInstance = await guildInstance.createMember({ userId: message.author.id, guildId: message.guild.id });

  let memberConfig = await memberInstance.getMemberConfig();

  if (!memberConfig) memberConfig = await memberInstance.createMemberConfig();

  global.memberInstance = memberInstance;

  const level = memberInstance.level;
  const xpTotal = memberInstance.xpTotal + Math.round(Math.random() * (level / 0.5));
  const xpRequired = memberInstance.xpRequired;

  memberInstance.update({ xpTotal: xpTotal, messages: memberInstance.messages + 1 });

  // Check if the member can level up
  if (xpTotal >= xpRequired) {
    memberInstance.update({ level: level + 1, xpRequired: Math.round(xpRequired * 1.5) });

    // Check if level mention is enabled
    if (guildConfig.levelMention && memberConfig.levelMention) {
      if (!(level % 5)) {
        const levelUpEmbed = new global.Discord.MessageEmbed()
          .setColor(colors.default)
          .setTitle(`${message.author.username} has levelled up!`)
          .setDescription(`${message.author} is now level ${formatNumber(level + 1)} and earned ${currency}500 as a reward!`);

        memberInstance.increment("balance", { by: 500 });

        message.channel.send(levelUpEmbed);
      }
    }
  }

  // Generate markov on mention of self
  if (message.mentions.users.first() === client.user) {
    const data = await client.database.properties.findByPk("data").then(key => key.value);
    const TextGenerator = require("node-markov-generator").TextGenerator;
    const generator = new TextGenerator(data);
 
    const result = generator.generateSentence();

    message.channel.send(result);
  }

  // Write message to data.json
  if (![prefix, ...ignore].some(x => message.content.startsWith(x))) {
    const data = guildInstance.data;

    data.push(message.content);

    await guildInstance.update({ data: data });
  }

  if (memberInstance.botBan) return;

  if (!message.content.startsWith(prefix)) return;

  // Check if command exists
  const args = message.content.slice(prefix.length).split(/ +/g);
  const commandName = args.shift().toLowerCase();
  let command = client.commands.get(commandName) || [...client.commands.values()].find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  // Check that command isn't disabled
  const disabledCommands = guildInstance.commands;
  if (disabledCommands.includes(commandName)) return;

  // Check if message author has permission
  if (message.author.id !== global.config.ownerID) {
    if (command.ownerOnly) return;
    if (!message.member.hasPermission(command.permissions)) {
      const permissionError = await message.channel.send(new global.Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle("Missing Permissions")
        .addField("You are missing one of the following permissions:", command.permissions.join(", "))
      );

      return permissionError.delete({ timeout: errorTimeout });
    }
  }

  // Check if parameters are correct
  const usageEmbed = new global.Discord.MessageEmbed()
    .setColor(colors.error)
    .setTitle(`Improper usage of ${commandName}`)
    .setDescription(command.description);

  if (command.parameters) {
    for (const parameter of command.parameters) {
      const i = command.parameters.indexOf(parameter);

      if (!parameter.required) continue;
      if (!args[i]) return error(command);

      try {
        if (parameter.type && JSON.parse(args[i]).constructor !== parameter.type) return error(command);
      } catch (e) {
        if (parameter.type !== String) return error(command);
      }
    }
  } else if (command.subCommands) {
    const subCommand = command.subCommands.find(subCommand => subCommand.name === args[0]);

    if (!subCommand) {
      const name = command.subCommands.map(subCommand => subCommand.name);

      usageEmbed.addField("Sub commands:", `\`[${name.join(" | ")}]\``);

      return message.channel.send(usageEmbed);
    }

    // Remove the sub command from the arguments array
    args.shift();

    if (subCommand.parameters) {
      for (const parameter of subCommand.parameters) {
        const i = subCommand.parameters.indexOf(parameter);

        if (!parameter.required) continue;
        if (!args[i]) return error(subCommand, subCommand.name);

        try {
          if (parameter.type && JSON.parse(args[i]).constructor !== parameter.type) return error(subCommand, subCommand.name);
        } catch (e) {
          if (parameter.type !== String) return error(subCommand, subCommand.name);
        }
      }
    }

    command = subCommand;
  }

  async function error (command, name) {
    const array = command.parameters.map(parameter => parameter.required ? `[${parameter.name}]` : `<${parameter.name}>`);

    usageEmbed.addField("Proper usage", `\`${prefix}${commandName}${name ? ` ${name} ` : " "}${array.join(" ")}\``);

    const usageMessage = await message.channel.send(usageEmbed);

    return usageMessage.delete({ timeout: errorTimeout });
  }

  // Check if command cool down exists
  if (message.author.id !== global.config.ownerID) {
    if (!client.coolDowns.has(commandName)) client.coolDowns.set(commandName, new Map());

    const now = Date.now();
    const timestamps = client.coolDowns.get(commandName);
    const coolDownLength = (command.coolDown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + coolDownLength;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;

        const coolDownEmbed = await message.channel.send(new global.Discord.MessageEmbed()
          .setColor(colors.error)
          .setTitle("Cool down active")
          .setDescription(`Please wait, a cool down of ${global.pluralize("second", timeLeft.toFixed(1), true)} is remaining.`)
        );

        return coolDownEmbed.delete({ timeout: errorTimeout });
      }
    }

    // Set cool down for command
    timestamps.set(message.author.id, now);

    await sleep(coolDownLength);

    // Delete cool down for command
    timestamps.delete(message.author.id);
  }

  const time = global.moment().format("HH:mm M/D/Y");
  const chalk = global.chalk;

  // Execute the command
  console.log(chalk.green(`(${time})`), chalk.cyan(`(${message.guild.name} #${message.channel.name})`), chalk.yellow(message.author.tag), message.content);

  try {
    return command.execute(client, message, args);
  } catch (error) {
    console.error(error);

    return message.channel.send(new global.Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle("An error has occurred")
      .setDescription(`\`\`\`js\n${error}\`\`\``)
      .setFooter("See console for more information")
    );
  }
};