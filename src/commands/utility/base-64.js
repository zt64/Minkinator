module.exports = {
  description: "Encode or decode a base 64 string.",
  aliases: [ "base64", "b64" ],
  subCommands: [
    {
      name: "encode",
      description: "Encode a base64 string.",
      parameters: [
        {
          name: "string",
          type: String,
          required: true
        }
      ],
      async execute (_, message, args) {
        const string = args.join(" ");
        return message.reply(Buffer.from(string).toString("base64"));
      }
    },
    {
      name: "decode",
      description: "Decode a base64 string.",
      parameters: [
        {
          name: "string",
          type: String,
          required: true
        }
      ],
      async execute (_, message, args) {
        const string = args.join(" ");
        return message.reply(Buffer.from(string, "base64").toString("ascii"));
      }
    }
  ]
};