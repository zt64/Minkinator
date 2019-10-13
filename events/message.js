const data = require('../data.json');

const today = new Date();
const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
const dateTime = date + ' ' + time;

let lastMessage = '';
let lastAuthor = '';
let counter = 0;

module.exports = async (client, message) => {
  if (message.author.bot) return;

  const member = await client.models.members.findByPk(message.author.id);

  const xpTotal = member.level + member.xp;
  const xpRequired = Math.pow(2, member.level);

  member.update({ xp: xpTotal, messages: member.messages + 1 });

  if (xpTotal >= xpRequired) {
    member.update({ level: member.level + 1 });

    if (member.level % 5 === 0) {
      member.update({ balance: member.balance + 500 });
      message.reply(`You leveled up to level ${member.level} and as a reward earned ${client.config.currency} 500 as a reward!`);
    } else {
      message.reply(`You leveled up to level ${member.level}!`);
    }
  }

  if (message.content === lastMessage && lastAuthor !== message.author) {
    counter += 1;
    if (counter === 3) {
      counter = 0;
      message.channel.send(message.content);
    }
  }

  lastMessage = message.content;
  lastAuthor = message.author;

  if (Math.random() > 0.95 || (message.mentions.users.first() && message.mentions.users.first().id === client.user.id)) {
    message.channel.send(client.markov.generate(), { disableEveryone: true });
  }

  if (!message.content.startsWith(client.config.prefix) && message.content.length >= 8) {
    data.push(message.content.toLowerCase());
    return client.fs.writeFileSync('./data.json', JSON.stringify(data));
  }

  if (!message.content.startsWith(client.config.prefix)) return;

  const args = message.content.slice(client.config.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (message.channel.type !== 'text') return message.reply('Commands cannot be run inside DMs.');
  if (command.permissions && !message.member.hasPermission(command.permissions)) return message.reply(`You are missing one of the required roles: ${command.permissions.join(', ')}.`);
  if (command.args && !args.length) return message.reply(`The proper usage for that command is \`${client.config.prefix}${commandName} ${command.usage}\``);
  if (command.ownerOnly && message.member.id !== client.config.ownerID) return message.reply('You are not allowed to run this command');
  if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new client.discord.Collection());

  if (message.author.id !== client.config.ownerID) {
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing ${command.name}.`);
      }
    }

    timestamps.set(message.author.id, now);

    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  try {
    console.log(dateTime, message.author.tag, command.name, args);
    return command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    return message.reply('An error has occured running that command.');
  }
};
