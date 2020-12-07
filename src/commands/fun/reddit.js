const entities = require("entities");

module.exports = {
  description: "Retrieves an image from a subreddit.",
  aliases: ["rdt"],
  parameters: [
    {
      name: "subreddit",
      type: String,
      required: true
    }
  ],
  async execute (client, message, [ subreddit ]) {
    const { redditNSFW, colors } = global.guildInstance.config;

    const body = await global.fetch(`https://api.reddit.com/r/${subreddit}/hot?limit=64`).then(response => response.json());

    // Check if subreddit exists and has posts
    if (!body.data) return message.channel.send(`Subreddit \`r/${subreddit}\` does not exist.`);

    // Filter posts if NSFW is disabled in guild config
    const posts = redditNSFW ? body.data.children : body.data.children.filter(post => !post.data.over_18);

    // Check if there are any posts
    if (!posts.length) return message.channel.send(`No posts found in \`r/${subreddit}\`.`);

    const post = posts[Math.floor(Math.random() * posts.length)].data;

    // Create embed
    const embed = new global.Discord.MessageEmbed()
      .setColor(colors.default)
      .setTitle(`r/${subreddit} ${post.title}`)
      .setURL(`https://reddit.com${post.permalink}`)
      .addField("Author:", `\`${post.author}\``, true)
      .addField("Score:", post.score, true);

    if (post.selftext) embed.setDescription(entities.decodeHTML(post.selftext));
    if (post.url.endsWith(".jpg") || post.url.endsWith(".png")) embed.setImage(post.url);

    return message.channel.send(embed);
  }
};