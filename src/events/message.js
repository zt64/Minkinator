module.exports = async (client, message) => {
  if (message.author.bot) return;

  if (message.channel.type === "dm") {
    if (message.author === client.user) return;
    
    const botOwner = await client.users.fetch(global.config.ownerID);
    const { author } = message;

    return botOwner.send(`Message from \`${author.tag} (${author.id})\`:\n${message.content}`);
  }

  const guildInstance = global.guildInstance = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true, nested: true } });
  const guildConfig = guildInstance.config;

  const { errorTimeout, currency, prefix, ignore, colors } = guildConfig;
  
  let memberInstance = global.memberInstance = await global.sequelize.models.member.findByPk(message.author.id, { include: { all: true, nested: true } });
  
  if (!memberInstance) memberInstance = await guildInstance.createMember({ userId: message.author.id, guildId: message.guild.id });
  if (!memberInstance.config) var memberConfig = await memberInstance.createConfig();

  const { level, xpTotal, xpRequired } = memberInstance;

  xpTotal + Math.round(Math.random() * (level / 0.5));

  await memberInstance.update({ xpTotal: xpTotal, messages: memberInstance.messages + 1 });

  // Check if the member can level up
  if (xpTotal >= xpRequired) {
    await memberInstance.update({ level: level + 1, xpRequired: Math.round(xpRequired * 1.5) });

    // Check if level mention is enabled
    if (guildConfig.levelMention && memberConfig.levelMention) {
      if (!(level + 1 % 5)) {
        const levelUpEmbed = new global.Discord.MessageEmbed({
          color: colors.default,
          title: `${message.author.username} has levelled up!`,
          description: `${message.author} is now level ${global.util.formatNumber(level + 1)} and earned ${currency}500 as a reward!`
        });

        await memberInstance.increment("balance", { by: 500 });

        message.channel.send(levelUpEmbed);
      }
    }
  }

  // Generate markov on mention of self
  if (message.mentions.has(client.user)) {

    const corpus = global.guildInstance.data;
    const chain = new global.markov();

    corpus.map(sentence => chain.update(sentence));

    chain.config.grams = global.util.randomInteger(1, 3);

    let sentence = chain.generate();
    let i = 0;
    
    // Prevent verbatim sentences from being generated
    while ((corpus.includes(sentence) || sentence.length <= 10) && i < 100) {
      sentence = chain.generate();
      i++;
    }

    message.channel.send(sentence);
  }

  // Write message to data.json
  if (![prefix, ...ignore].some(x => message.content.startsWith(x))) {
    guildInstance.data.push(message.content);

    const g = await global.sequelize.models.guild.findByPk(message.guild.id);
    await g.update({ data: guildInstance.data });
  }

  if (!message.content.startsWith(prefix) || memberInstance.botBan) return;

  // Check if command exists
  const parameters = message.content.slice(prefix.length).split(/ +/g);
  const commandName = parameters.shift().toLowerCase();
  let command = client.commands.find(command => command.name === commandName) || [...client.commands.values()].find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  
  if (!command) return;

  // Check that the command isn't disabled
  const disabledCommands = guildInstance.commands;
  if (disabledCommands.includes(commandName)) return;

  // Check if message author has permission
  if (message.author.id !== global.config.ownerID) {
    if (command.ownerOnly) return;
    if (!message.member.hasPermission(command.permissions)) {
      const permissionError = await message.channel.send(new global.Discord.MessageEmbed({
        color: colors.error,
        title: "Missing Permissions",
        fields: [ { name: "You are missing one of the following permissions:", value: command.permissions.join(", ") } ]
      }));

      return permissionError.delete({ timeout: errorTimeout });
    }
  }

  // Check if parameters are correct
  const usageEmbed = new global.Discord.MessageEmbed({
    color: colors.error,
    title: `Improper usage of ${commandName}`,
    description: command.description
  });

  if (command.parameters) {
    for (const parameter of command.parameters) {
      const i = command.parameters.indexOf(parameter);

      if (!parameter.required) continue;
      if (!parameters[i]) return error(command);

      try {
        if (parameter.type && JSON.parse(parameters[i]).constructor !== parameter.type) return error(command);
      } catch (e) {
        if (parameter.type !== String) return error(command);
      }
    }
  } else if (command.subCommands) {
    const subCommand = command.subCommands.find(subCommand => subCommand.name === parameters[0]);

    if (!subCommand) {
      const name = command.subCommands.map(subCommand => subCommand.name);

      usageEmbed.addField("Sub commands:", `\`[${name.join(" | ")}]\``);

      return message.channel.send(usageEmbed);
    }

    // Remove the sub command from the arguments array
    parameters.shift();

    if (subCommand.parameters) {
      for (const parameter of subCommand.parameters) {
        const i = subCommand.parameters.indexOf(parameter);

        if (!parameter.required) continue;
        if (!parameters[i]) return error(subCommand, subCommand.name);

        try {
          if (parameter.type && JSON.parse(parameters[i]).constructor !== parameter.type) return error(subCommand, subCommand.name);
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

        const coolDownEmbed = await message.channel.send(new global.Discord.MessageEmbed({
          color: colors.error,
          title: "Cool down active",
          description: `Please wait, a cool down of ${global.pluralize("second", timeLeft.toFixed(1), true)} is remaining.`
        }));

        coolDownEmbed.delete({ timeout: errorTimeout });
      }

      timestamps.set(message.author.id, now);

      setTimeout(() => timestamps.delete(message.author.id), coolDownLength);
    }

    // Set cool down for the command
    timestamps.set(message.author.id, now);
  }

  const time = global.moment().format("HH:mm M/D/Y");
  const { chalk } = global;

  console.log(chalk.green(`(${time})`), chalk.cyan(`(${message.guild.name} #${message.channel.name})`), chalk.yellow(message.author.tag), message.content);

  // Execute the command
  try {
    return command.execute(client, message, parameters);
  } catch (error) {
    console.error(error);

    return message.channel.send(new global.Discord.MessageEmbed({
      color: colors.error,
      title: "An error has occurred",
      description: `\`\`\`js\n${error}\`\`\``,
      footer: { text: "See console for more information" }
    }));
  }
};