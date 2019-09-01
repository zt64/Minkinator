module.exports = {
  name: 'emit',
  description: 'Emits an event.',
  execute (client, message, args) {
    client.emit(args[0], args[1])
  }
}
