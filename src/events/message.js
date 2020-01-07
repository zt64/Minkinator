module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return message.channel.send('Commands cannot be run inside DMs.');

  const models = await client.models[message.guild.name];

  const time = client.moment().format('HH:mm M/D/Y');
  const prefix = (await models.variables.findByPk('prefix')).value;
  const memberData = await models.members.findByPk(message.author.id);

  let level = memberData.level;
  const xpTotal = Math.round(Math.random() * level) + memberData.xp;
  const xpRequired = 15 * level * (level + 1);

  const lastMessage = message.content;
  const lastAuthor = message.author;
  let index = 0;

  memberData.update({ xp: xpTotal, messages: memberData.messages + 1 });

  if (xpTotal >= xpRequired) {
    memberData.increment('level', { by: 1 });
    level++;

    const levelUpEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle(`${message.author.username} has levelled up!`)
      .setTimestamp();

    if (level % 5 === 0) {
      memberData.increment('balance', { by: 500 });

      levelUpEmbed.setDescription(`${message.author} is now level ${level} and earned ${client.config.currency}500 as a reward!`);
      message.channel.send(levelUpEmbed);
    } else {
      levelUpEmbed.setDescription(`${message.author} is now level ${level}.`);
      message.channel.send(levelUpEmbed);
    }
  }

  if (message.content === lastMessage && lastAuthor !== message.author) {
    index++;
    if (index >= 3) {
      message.channel.send(message.content);
      index = 0;
    }
  }

  if (!message.content.startsWith(prefix) && !message.content.startsWith('%') && message.content.length >= 8) {
    const data = require('../data.json');

    data.push(message.content.toLowerCase());
    return client.fs.writeFileSync('./data.json', JSON.stringify(data));
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if ((command.permissions && !message.member.hasPermission(command.permissions)) || (command.botOwner && message.author.id !== client.config.botOwner)) {
    const permissionError = await message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embedError)
      .setTitle('Missing Permissions')
      .addField('You are missing one the following permissions:', command.permissions ? command.permissions.join(', ') : 'Bot Owner only')
    );

    return permissionError.delete({ timeout: (await models.variables.findByPk('errorTimeout')).value });
  }

  if (command.args && !args.length) {
    const usageError = await message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embedError)
      .setTitle(`Improper Usage of ${commandName}`)
      .setDescription(command.description)
      .addField('Proper Usage:', `${prefix}${commandName} ${command.usage}`)
    );

    return usageError.delete({ timeout: (await models.variables.findByPk('errorTimeout')).value });
  }

  async function error () {
    const usageMessage = await message.channel.send(usageEmbed);
    return usageMessage.delete({ timeout: (await models.variables.findByPk('errorTimeout')).value });
  }

  if (command.parameters) {
    var usageEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embedError)
      .setTitle(`Improper usage of ${commandName}`)
      .setDescription(command.description)
      .addField('Proper usage', `${prefix}${command.name} `);

    command.parameters.map(parameter => {
      const field = usageEmbed.fields[0];

      parameter.required ? field.value += `[${parameter.name}] ` : field.value += `<${parameter.name}> `;
    });

    for (const parameter of command.parameters) {
      const i = command.parameters.indexOf(parameter);

      if (!parameter.required) continue;
      if (!args[i]) return error();

      try {
        if (JSON.parse(args[i]).constructor !== parameter.type) return error();
      } catch (e) {
        if (parameter.type !== String) return error();
      }
    };
  };

  if (!client.coolDowns.has(command.name)) client.coolDowns.set(command.name, new client.discord.Collection());

  if (message.author.id !== client.config.botOwner || !message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
    const now = Date.now();
    const timestamps = client.coolDowns.get(command.name);
    const coolDownAmount = (command.coolDown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + coolDownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing ${command.name}.`);
      }
    }

    timestamps.set(message.author.id, now);

    setTimeout(() => timestamps.delete(message.author.id), coolDownAmount);
  }

  message.channel.startTyping();

  try {
    console.log(`(${time}) (${message.guild.name} #${message.channel.name})`, message.author.tag, message.content);
    command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply('An error has occurred running that command.');
  }

  return message.channel.stopTyping();
};