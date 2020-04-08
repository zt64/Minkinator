module.exports = async (client, message) => {
  const time = client.moment().format('HH:mm M/D/Y');

  // Return if in DM channel

  if (message.channel.type === 'dm') {
    if (message.author.bot) return;

    return message.channel.send('Commands cannot be run inside DMs.');
  }

  // Set constants

  const guildDatabase = await client.databases[message.guild.name];

  const guildProperties = guildDatabase.properties;
  const guildMembers = guildDatabase.members;

  client.database = guildDatabase;

  // Set guild constants

  const guildConfig = await guildProperties.findByPk('configuration').then(key => key.value);
  const errorTimeout = guildConfig.errorTimeout;
  const currency = guildConfig.currency;
  const prefix = guildConfig.prefix;

  // Return if ignoreBots is true and author is bot

  if (guildConfig.ignoreBots && message.author.bot) return;

  // Set member constants;

  const memberData = await guildMembers.findByPk(message.author.id);
  const memberConfig = memberData.configuration;

  let level = memberData.level;

  const xpTotal = Math.round(Math.random() * (level / 0.5)) + memberData.xp;
  const xpRequired = memberData.xpRequired;

  memberData.update({ xp: xpTotal, messages: memberData.messages + 1 });

  // Check if message author can level up

  if (xpTotal >= xpRequired) {
    memberData.update({ level: level + 1, xpRequired: 15 * level });
    level++;

    if (guildConfig.levelMention && memberConfig.levelMention) {
      const levelUpEmbed = new client.Discord.MessageEmbed()
        .setColor(client.config.embed.color)
        .setTitle(`${message.author.username} has levelled up!`)
        .setDescription(`${message.author} is now level ${level}.`);

      if (!(level % 5)) {
        levelUpEmbed.setDescription(`${message.author} is now level ${level} and earned ${currency}500 as a reward!`);
        memberData.increment('balance', { by: 500 });
      }

      message.channel.send(levelUpEmbed);
    }
  }

  // Write message to data.json

  if (!message.content.startsWith(prefix) && !message.content.startsWith('::') && message.content.length >= 8) {
    const dataProperty = await guildProperties.findByPk('data');
    const data = dataProperty.value;

    data.push(message.content.toLowerCase());

    return dataProperty.update({ value: data });
  }

  if (!message.content.startsWith(prefix)) return;

  // Check if command exists

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (message.author.id !== client.config.ownerID) {
    // Check if message author has permission

    if (command.ownerOnly || (!message.member.hasPermission(command.permissions))) {
      const permissionError = await message.channel.send(new client.Discord.MessageEmbed()
        .setColor(client.config.embed.error)
        .setTitle('Missing Permissions')
        .addField('You are missing one of the following permissions:', command.permissions ? command.permissions.join(', ') : 'Bot owner only')
      );

      return permissionError.delete({ timeout: errorTimeout });
    }
  }

  // Check if parameters are correct

  if (command.parameters) {
    var usageEmbed = new client.Discord.MessageEmbed()
      .setColor(client.config.embed.error)
      .setTitle(`Improper usage of ${commandName}`)
      .setDescription(command.description)
      .addField('Proper usage', `${prefix}${commandName} `);

    for (const parameter of command.parameters) {
      const i = command.parameters.indexOf(parameter);

      if (!parameter.required) continue;
      if (!parameter.type) continue;
      if (!args[i]) return error();

      try {
        if (JSON.parse(args[i]).constructor !== parameter.type) return error();
      } catch (e) {
        if (parameter.type !== String) return error();
      }
    };
  };

  async function error () {
    command.parameters.map(parameter => {
      const field = usageEmbed.fields[0];

      parameter.required ? field.value += `[${parameter.name}] ` : field.value += `<${parameter.name}> `;
    });

    const usageMessage = await message.channel.send(usageEmbed);

    return usageMessage.delete({ timeout: errorTimeout });
  }

  // Check if command cool down exists

  if (message.author.id !== client.config.ownerID) {
    if (!client.coolDowns.has(commandName)) client.coolDowns.set(commandName, new client.Discord.Collection());

    const now = Date.now();
    const timestamps = client.coolDowns.get(commandName);
    const coolDownAmount = (command.coolDown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + coolDownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;

        const coolDownError = await message.channel.send(new client.Discord.MessageEmbed()
          .setColor(client.config.embed.error)
          .setTitle('Cool down active')
          .setDescription(`Please wait, a cool down of ${timeLeft.toFixed(1)} second(s) is remaining.`)
        );

        return coolDownError.delete({ timeout: errorTimeout });
      }
    }

    timestamps.set(message.author.id, now);

    setTimeout(() => timestamps.delete(message.author.id), coolDownAmount);
  }

  // Execute the command

  message.channel.startTyping();

  console.log(`(${time})`.green + ` (${message.guild.name} #${message.channel.name})`.cyan, message.author.tag, message.content);
  try {
    await command.execute(client, message, args);
  } catch (error) {
    console.error(error);

    message.channel.send(new client.Discord.MessageEmbed()
      .setColor(client.config.embed.error)
      .setTitle('An error has occurred')
      .setDescription(error, { code: 'js' })
      .setFooter('See console for more information')
    );
  }

  return message.channel.stopTyping();
};