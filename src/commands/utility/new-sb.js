module.exports = {
  description: "Sub command test",
  subCommands: [
    {
      name: "one",
      description: "Sub command 1",
      parameters: [
        {
          name: "oneString",
          type: String,
          required: true
        },
        {
          name: "oneNumber",
          type: Number,
          required: true
        },
        {
          name: "oneBool",
          type: Boolean,
          required: true
        }
      ],
      async execute (client, message, args) {
        return console.log("Sub command 1");
      }
    },
    {
      name: "two",
      description: "Sub command 2",
      parameters: [
        {
          name: "twoString",
          type: String,
          required: true
        },
        {
          name: "twoNumber",
          type: Number,
          required: true
        },
        {
          name: "twoBool",
          type: Boolean,
          required: true
        }
      ],
      async execute (client, message, args) {
        return console.log("Sub command 2");
      }
    }
  ]
};