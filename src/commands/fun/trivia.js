module.exports = {
  description: "Play a game of trivia.",
  aliases: ["quiz"],
  async execute (client, message, args) {
    const { randomInteger, sleep } = client.functions;
    const entities = require("entities");

    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;
    const currency = guildConfig.currency;

    // Fetch question

    const responses = await client.fetch("https://opentdb.com/api.php?amount=1").then(res => res.json());
    const response = responses.results[0];

    const question = entities.decodeHTML(response.question);

    const correctAnswer = response.correct_answer;
    const incorrectAnswers = response.incorrect_answers;
    const answers = incorrectAnswers;

    const correctIndex = randomInteger(0, 3);

    answers.splice(correctIndex, 0, correctAnswer);

    const letters = ["A", "B", "C", "D"];

    const reward = randomInteger(20, 50);

    // Create embed

    const questionEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle(`${response.category} question`)
      .setDescription(question)
      .setFooter(`This question is worth ${currency}${reward}`);

    if (response.type === "multiple") {
      answers.map((answer, index) => questionEmbed.addField(letters[index], answer, true));
    } else {
      questionEmbed.addField("A", "True");
      questionEmbed.addField("B", "False");
    }

    const questionMessage = await message.channel.send(questionEmbed);

    if (response.type === "multiple") {
      ["🇦", "🇧", "🇨", "🇩"].map(reaction => questionMessage.react(reaction));
    } else {
      ["🇦", "🇧"].map(reaction => questionMessage.react(reaction));
    }

    await sleep(15000);

    const users = [];

    const reactions = questionMessage.reactions.cache.array();

    for (const user of reactions[correctIndex].users.cache.array()) {
      if (user.id === client.user.id) continue;

      users.push(user);
    }

    for (const user of users) {
      const data = await client.database.members.findByPk(user.id);
      const balance = data.balance + reward;

      await data.update({ balance: balance });
    }

    const answerEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle("Trivia Answer");

    if (users.length) {
      answerEmbed.setDescription(`The correct answer was ${letters[correctIndex]}: \`${correctAnswer}\`, \n ${currency}${reward} has been sent to ${users}.`);
    } else {
      answerEmbed.setDescription(`The correct answer was ${letters[correctIndex]}: \`${correctAnswer}\`. No one got it this round.`);
    }

    return message.channel.send(answerEmbed);
  }
};