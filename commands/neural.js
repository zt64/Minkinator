module.exports = {
  name: 'neural',
  description: 'neural network test',
  usage: '<input>',
  execute (client, message, args) {
    const input = message.content.slice(8);
    return message.channel.send(`${input} ${client.net.run(input)}`);
  }
};
