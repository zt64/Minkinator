module.exports = {
  description: "Sub command test",
  subCommands: [
    {
      name: "Subcommand 1",
      description: "Subcommand 1",
      parameters: [
        {
          name: "arg",
          type: String,
          required: true
        }
      ],
      async execute (client, message, args) {
        return console.log("Sub command 1");
      }
    },
    {
      name: "Subcommand 2",
      description: "Subcommand 1",
      parameters: [
        {
          name: "arg",
          type: String,
          required: true
        }
      ],
      async execute (client, message, args) {
        return console.log("Sub command 2");
      }
    }
  ]
};