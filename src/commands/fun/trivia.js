module.exports = {
  name: 'trivia',
  description: 'Play a game of trivia',
  aliases: ['t', 'quiz'],
  parameters: [
    {
      name: 'start/stop',
      type: String,
      required: true
    },
    {
      name: 'category',
      type: String
    }
  ],
  async execute (client, message, args) {
    const randomInteger = client.functions.randomInteger;
    const token = (await (await client.fetch('https://opentdb.com/api_token.php?command=request')).json()).token;

    const question = (await (await client.fetch(`https://opentdb.com/api.php?amount=1&token=${token}`)).json()).results[0];

    const questionEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle(`${question.category} question`)
      .setDescription(question.question);

    const answer = question.correct_answer;
    const answers = question.incorrect_answers;

    answers.splice(randomInteger(0, 3), 0, answer);

    const letters = ['A', 'B', 'C', 'D'];

    if (question.type === 'multiple') {
      answers.map((answer, index) => questionEmbed.addField(letters[index], answer));
    } else {
      questionEmbed.addField('A', 'True');
      questionEmbed.addField('B', 'False');
    }

    const questionMessage = await message.channel.send(questionEmbed);

    if (question.type === 'multiple') {
      ['🇦', '🇧', '🇨', '🇩'].map(reaction => questionMessage.react(reaction));
    } else {
      ['🇦', '🇧'].map(reaction => questionMessage.react(reaction));
    }

    await setTimeout(() => {
      message.channel.send(new client.discord.MessageEmbed()
        .setColor(client.config.embed.color)
        .setTitle('Trivia Answer')
        .setDescription(`The correct answer was ${answer}, \n Good job`)
      );
    }, 20000);
  }
};