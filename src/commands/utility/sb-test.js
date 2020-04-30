module.exports = {
  description: 'Testing sub commands.',
  subCommands: [
    {
      name: 'one',
      parameters: [
        {
          name: 'string',
          type: String,
          required: true
        },
        {
          name: 'number',
          type: Number,
          required: true
        },
        {
          name: 'bool',
          type: Boolean,
          required: true
        }
      ]
    },
    {
      name: 'two',
      parameters: [
        {
          name: 'string',
          type: String,
          required: true
        },
        {
          name: 'number',
          type: Number,
          required: true
        },
        {
          name: 'bool',
          type: Boolean,
          required: true
        }
      ]
    },
    {
      name: 'two',
      parameters: [
        {
          name: 'string',
          type: String,
          required: true
        },
        {
          name: 'number',
          type: Number,
          required: true
        },
        {
          name: 'bool',
          type: Boolean,
          required: true
        }
      ]
    }
  ],
  async execute (client, message, args) {
    const subCommand = args[0];

    if (subCommand === 'one') return message.channel.send('one');
    if (subCommand === 'two') return message.channel.send('two');
    if (subCommand === 'three') return message.channel.send('three');
  }
};