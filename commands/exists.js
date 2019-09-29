module.exports = {
  name: 'exists',
  description: 'exists command',
  execute (client, message, args) {
    try {
      const exists = eval(`(client.${args[0]})`) === undefined;
      message.channel.send(!exists);
    } catch (e) {
      message.channel.send(e);
    }
  }
};
