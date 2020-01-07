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
    async execute(client, message, args) {
        const randomInteger = client.functions.randomInteger;
        const token = (await (await client.fetch('https://opentdb.com/api_token.php?command=request')).json()).token;
        const question = (await (await client.fetch(`https://opentdb.com/api.php?amount=1&token=${token}`)).json()).results[0];
        const questionEmbed = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(`${question.category} question`)
            .setDescription(question.question);
        const answer = question.correct_answer;
        const answers = question.incorrect_answers;
        answers.splice(randomInteger(0, 3), 0, answer);
        const letters = ['A', 'B', 'C', 'D'];
        if (question.type === 'multiple') {
            answers.map((answer, index) => questionEmbed.addField(letters[index], answer));
        }
        else {
            questionEmbed.addField('A', 'True');
            questionEmbed.addField('B', 'False');
        }
        const questionMessage = await message.channel.send(questionEmbed);
        if (question.type === 'multiple') {
            ['🇦', '🇧', '🇨', '🇩'].map(reaction => questionMessage.react(reaction));
        }
        else {
            ['🇦', '🇧'].map(reaction => questionMessage.react(reaction));
        }
        await setTimeout(() => {
            message.channel.send(new client.discord.MessageEmbed()
                .setColor(client.config.embedColor)
                .setTitle('Trivia Answer')
                .setDescription(`The correct answer was ${answer}, \n Good job`));
        }, 20000);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpdmlhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3RyaXZpYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLFFBQVE7SUFDZCxXQUFXLEVBQUUsdUJBQXVCO0lBQ3BDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUM7SUFDdEIsVUFBVSxFQUFFO1FBQ1Y7WUFDRSxJQUFJLEVBQUUsWUFBWTtZQUNsQixJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxJQUFJO1NBQ2Y7UUFDRDtZQUNFLElBQUksRUFBRSxVQUFVO1lBQ2hCLElBQUksRUFBRSxNQUFNO1NBQ2I7S0FDRjtJQUNELEtBQUssQ0FBQyxPQUFPLENBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQ2xDLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO1FBQ3JELE1BQU0sS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFFN0csTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkgsTUFBTSxhQUFhLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTthQUNwRCxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7YUFDbEMsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDLFFBQVEsV0FBVyxDQUFDO2FBQ3pDLGNBQWMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFckMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQztRQUN2QyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUM7UUFFM0MsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUUvQyxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXJDLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7WUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDaEY7YUFBTTtZQUNMLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3BDLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3RDO1FBRUQsTUFBTSxlQUFlLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVsRSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFO1lBQ2hDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQzNFO2FBQU07WUFDTCxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDL0Q7UUFFRCxNQUFNLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDcEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtpQkFDbkQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2lCQUNsQyxRQUFRLENBQUMsZUFBZSxDQUFDO2lCQUN6QixjQUFjLENBQUMsMEJBQTBCLE1BQU0sZUFBZSxDQUFDLENBQ2pFLENBQUM7UUFDSixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDWixDQUFDO0NBQ0YsQ0FBQyJ9