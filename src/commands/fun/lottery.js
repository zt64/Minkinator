module.exports = {
  description: 'Once a day try your chance at the lottery for a big reward.',
  async execute (client, message, args) {
    return message.channel.send('yes');
  }
};