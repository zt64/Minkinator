module.exports = {
  description: 'Retrieves an image from a subreddit.',
  aliases: ['rdt'],
  parameters: [
    {
      name: 'subreddit',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const guildConfig = (await client.database.properties.findByPk('configuration')).value;
    const subreddit = args[0];
    const body = await (await client.fetch(`https://www.reddit.com/r/${subreddit}/top/.json?limit=256`)).json();

    if (!body.data) return message.channel.send(`Subreddit \`\`r/${subreddit}\`\` does not exist.`);

    const posts = guildConfig.redditNSFW ? body.data.children : body.data.children.filter(post => !post.data.over_18);

    if (!posts.length) return message.channel.send(`No posts found in \`\`r/${subreddit}.\`\``);

    const post = posts[Math.floor(Math.random() * posts.length)].data;

    const embed = new client.Discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle(`r/${subreddit} ${post.title}`)
      .setURL(`https://reddit.com${post.permalink}`)
      .setDescription(post.selftext ? post.selftext : '\u200b')
      .addField('Author:', `\`${post.author}\``, true)
      .addField('Score:', post.score, true);

    if (post.url.endsWith('.jpg') || post.url.endsWith('.png')) embed.setImage(post.url);

    return message.channel.send(embed);
  }
};