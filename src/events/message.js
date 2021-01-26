const MarkovChain = require("purpl-markov-chain");
const pluralize = require("pluralize");
const Discord = require("discord.js");
const chalk = require("chalk");

module.exports = async (client, message) => {
  if (message.author.bot && !message.content.match(/^\w{2}/)?.length) return;

  console.log(message.content);

  if (message.channel.type === "dm") {
    if (message.author === client.user) return;

    const botOwner = await client.users.fetch(global.config.ownerID);
    const { author } = message;

    return botOwner.send(`Message from \`${author.tag} (${author.id})\`:\n${message.content}`);
  }

  const guildInstance = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true } });
  const guildConfig = guildInstance.config;

  const { errorTimeout, prefix, colors } = guildConfig;

  const [ memberInstance ] = await global.sequelize.models.member.findOrCreate({ where: { userId: message.author.id }, include: { all: true } });

  // Generate markov on mention of self
  if (message.mentions.has(client.user) || Math.random() >= 0.98) message.channel.send(await util.generateSentence(guildInstance.corpus));

  // Write message to data.json
  if (!message.content.startsWith(prefix)) {
    const chain = new MarkovChain(guildInstance.corpus);
    let sentence = message.content;

    if (message.attachments.size) sentence += ` ${message.attachments.map(attachment => attachment.url).join()}`;

    chain.update(sentence);

    await guildInstance.update({ corpus: chain.toJSON() });
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
  if (!util.hasPermission(message.member, command)) {
    const permissionError = await message.channel.send({
      embed: {
        color: colors.error,
        title: "Missing Permissions",
        fields: [ { name: "You are missing one of the following permissions:", value: command.permissions.join(", ") || "Bot Owner Only" } ]
      }
    });

    return permissionError.delete({ timeout: errorTimeout });
  }

  // Check if parameters are correct
  const usageEmbed = new Discord.MessageEmbed({
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

        const coolDownEmbed = await message.channel.send({
          embed: {
            color: colors.error,
            title: "Cool down active",
            description: `Please wait, a cool down of ${pluralize("second", timeLeft.toFixed(1), true)} is remaining.`
          }
        });

        coolDownEmbed.delete({ timeout: errorTimeout });
      }

      timestamps.set(message.author.id, now);

      setTimeout(() => timestamps.delete(message.author.id), coolDownLength);
    }

    // Set cool down for the command
    timestamps.set(message.author.id, now);
  }

  console.log(chalk.green(`(${util.time()})`), chalk.cyan(`(${message.guild.name} #${message.channel.name})`), chalk.yellow(message.author.tag), message.content);

  // Execute the command
  try {
    return command.execute(client, message, parameters);
  } catch (error) {
    console.error(error);

    return message.channel.send({
      embed: {
        color: colors.error,
        title: "An error has occurred",
        description: `\`\`\`js\n${error}\`\`\``,
        footer: { text: "See console for more information" }
      }
    });
  }
};