module.exports = {
  name: 'model',
  description: 'test',
  async execute (client, message, args) {
    console.log(client.model);
  }
};