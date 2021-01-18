const entities = require("entities");
const fetch = require("node-fetch");
module.exports = {
  description: "Play a game of trivia.",
  aliases: ["quiz"],
  async execute (client, message) {
    const { randomInteger, sleep } = util;

    const { currency, colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    let correctIndex = 0;

    // Fetch question
    const responses = await fetch("https://opentdb.com/api.php?amount=1").then(res => res.json());
    const [ response ] = responses.results;

    const question = entities.decodeHTML(response.question);

    const correctAnswer = response.correct_answer;
    const incorrectAnswers = response.incorrect_answers;
    const answers = incorrectAnswers;

    if (response.type === "multiple") {
      correctIndex = randomInteger(0, 3);

      answers.splice(correctIndex, 0, correctAnswer);
    }

    const letters = ["A", "B", "C", "D"];

    const reward = randomInteger(20, 50);

    // Create embed
    const questionEmbed = new Discord.MessageEmbed()
      .setColor(colors.default)
      .setTitle(`${response.category} question`)
      .setDescription(question)
      .setFooter(`This question is worth ${currency}${reward}`);

    if (response.type === "multiple") {
      answers.map((answer, index) => questionEmbed.addField(letters[index], entities.decodeHTML(answer), true));
    } else {
      questionEmbed.addField("A", "True", true);
      questionEmbed.addField("B", "False", true);
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

    // Check for correct answer
    for (const user of reactions[correctIndex].users.cache.array()) {
      if (user.id === client.user.id) continue;

      users.push(user);
    }

    // Update balances
    for (const user of users) {
      const memberInstance = await global.sequelize.models.member.findByPk(user.id);

      await memberInstance.increment("balance", { by: reward });
    }

    const answerEmbed = new Discord.MessageEmbed({
      color: colors.default,
      title: "Trivia Answer"
    });

    if (users.length) {
      answerEmbed.setDescription(`The correct answer was ${letters[correctIndex]}: \`${correctAnswer}\`, \n ${currency}${reward} has been sent to ${users}.`);
    } else {
      answerEmbed.setDescription(`The correct answer was ${letters[correctIndex]}: \`${correctAnswer}\`. No one got it this round.`);
    }

    return message.channel.send(answerEmbed);
  }
};