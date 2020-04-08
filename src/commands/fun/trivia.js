module.exports = {
  description: 'Play a game of trivia',
  aliases: ['quiz'],
  parameters: [
    {
      name: 'category',
      type: String
    }
  ],
  async execute (client, message, args) {
    const entities = require('entities');

    // Fetch questions

    const responses = (await (await client.fetch('https://opentdb.com/api.php?amount=10')).json());
    const response = responses.results[0];

    const question = entities.decodeHTML(response.question);

    const correctAnswer = response.correct_answer;
    const incorrectAnswers = response.incorrect_answers;

    const answers = incorrectAnswers.push(correctAnswer);

    const letters = ['A', 'B', 'C', 'D'];

    // Create embed

    const questionEmbed = new client.Discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle(`${response.category} question`)
      .setDescription(question);

    if (response.type === 'multiple') {
      answers.map((answer, index) => questionEmbed.addField(letters[index], answer));
    } else {
      questionEmbed.addField('A', 'True');
      questionEmbed.addField('B', 'False');
    }

    const questionMessage = await message.channel.send(questionEmbed);

    if (response.type === 'multiple') {
      ['🇦', '🇧', '🇨', '🇩'].map(reaction => questionMessage.react(reaction));
    } else {
      ['🇦', '🇧'].map(reaction => questionMessage.react(reaction));
    }

    // Setup reaction collector

    const filter = (reaction, user) => ['🇦', '🇧', '🇨', '🇩'].map(emoji => reaction.emoji.name === emoji);

    const collector = questionMessage.createReactionCollector;

    collector.on('end', collected => {
      message.channel.send(new client.Discord.MessageEmbed()
        .setColor(client.config.embed.color)
        .setTitle('Trivia Answer')
        .setDescription(`The correct answer was ${answer}, \n Good job`)
      );
    }
    );
  }
};