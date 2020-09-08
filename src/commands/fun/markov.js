module.exports = {
  description: "Generates a markov chain.",
  aliases: [ "mkv" ],
  async execute (client, message, args) {
    const data = global.guildInstance.data;
    const chain = new global.MarkovChain();

    // Add data
    data.map(string => chain.update(string));

    const result = (() => {
      let e = "";
      while (e.length < 5) {
        if (args) {
          e = chain.generate({ from: args.join(" ") });
        } else {
          e = chain.generate();
        }
      }
      return e;
    });
    
    return message.channel.send(result());
  }
};