module.exports = async (client, message) => {
  const time = client.moment().format('HH:mm M/D/Y');

  if (message.channel.type === 'dm') {
    if (message.author.bot) return;

    return message.channel.send('Commands cannot be run inside DMs.');
  }

  const guildDatabase = await client.databases[message.guild.name];

  const guildVariables = guildDatabase.variables;
  const guildMembers = guildDatabase.members;

  const guildConfig = (await guildVariables.findByPk('configuration')).value;

  if (guildConfig.ignoreBots && message.author.bot) return;

  const errorTimeout = (await guildVariables.findByPk('errorTimeout')).value;

  const guildPrefix = (await guildVariables.findByPk('prefix')).value;
  const memberData = await guildMembers.findByPk(message.author.id);

  const memberConfig = memberData.configuration;
  const level = memberData.level;

  const xpTotal = Math.round(Math.random() * level) + memberData.xp;
  const xpRequired = 15 * level * (level + 1);

  memberData.update({ xp: xpTotal, messages: memberData.messages + 1 });

  client.database = guildDatabase;

  // Check if message author can level up

  if (xpTotal >= xpRequired) {
    memberData.increment('level', { by: 1 });

    const levelUpEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle(`${message.author.username} has levelled up!`)
      .setTimestamp();

    if (guildConfig.levelUpMention && memberConfig.levelUpMention) { 
      if (!(level % 5)) {
        memberData.increment('balance', { by: 500 });

        levelUpEmbed.setDescription(`${message.author} is now level ${level + 1} and earned ${client.config.currency}500 as a reward!`);
        
        message.channel.send(levelUpEmbed);
      } else {
        levelUpEmbed.setDescription(`${message.author} is now level ${level + 1}.`);
        
        message.channel.send(levelUpEmbed);
      }
    }
  }

  // Write message to data.json

  if (!message.content.startsWith(guildPrefix) && !message.content.startsWith('%') && message.content.length >= 8) {
    const data = JSON.parse(client.fs.readFileSync('./data/data.json'));

    data.push(message.content.toLowerCase());

    return client.fs.writeFileSync('./data/data.json', JSON.stringify(data));
  }

  if (!message.content.startsWith(guildPrefix)) return;

  // Check if command exists

  const args = message.content.slice(guildPrefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (message.author.id !== client.config.ownerID) {
    // Check if message author has permission

    if (command.ownerOnly || (!message.member.hasPermission(command.permissions))) {
      const permissionError = await message.channel.send(new client.discord.MessageEmbed()
        .setColor(client.config.embed.error)
        .setTitle('Missing Permissions')
        .addField('You are missing one of the following permissions:', command.permissions ? command.permissions.join(', ') : 'Bot owner only')
      );

      return permissionError.delete({ timeout: errorTimeout });
    }

    if (!client.coolDowns.has(command.name)) client.coolDowns.set(command.name, new client.discord.Collection());

    // Check if command cool down exists

    const now = Date.now();
    const timestamps = client.coolDowns.get(command.name);
    const coolDownAmount = (command.coolDown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + coolDownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;

        const coolDownError = await message.channel.send(new client.discord.MessageEmbed()
          .setColor(client.config.embed.error)
          .setTitle('Cool down active')
          .setDescription(`Please wait, a cool down of ${timeLeft.toFixed(1)} second(s) is remaining.`)
        );

        return coolDownError.delete({ timeout: (await guildVariables.findByPk('errorTimeout')).value });
      }
    }

    timestamps.set(message.author.id, now);

    setTimeout(() => timestamps.delete(message.author.id), coolDownAmount);
  }

  // Check if parameters are correct

  if (command.parameters) {
    var usageEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.error)
      .setTitle(`Improper usage of ${commandName}`)
      .setDescription(command.description)
      .addField('Proper usage', `${guildPrefix}${command.name} `);

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

  // Execute the command

  message.channel.startTyping();

  try {
    console.log(`(${time})`.green + ` (${message.guild.name} #${message.channel.name})`.cyan, message.author.tag, message.content);

    await command.execute(client, message, args);
  } catch (error) {
    console.error(error);

    message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embed.error)
      .setTitle('Command Execution Error')
      .setDescription(`\`\`\`${error}\`\`\``)
      .setFooter('See console for more information')
    )
  }

  return message.channel.stopTyping();
};