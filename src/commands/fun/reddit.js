const entities = require("entities");
const fetch = require("node-fetch");

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
  config: [
    {
      key: "nsfw",
      default: false
    }
  ],
  async execute (client, message, [ subreddit ]) {
    const body = await fetch(`https://api.reddit.com/r/${subreddit}/hot?limit=64`).then(response => response.json());

    // Check if subreddit exists and has posts
    if (!body.data) return message.reply(`Subreddit \`r/${subreddit}\` does not exist.`);

    // Remove NSFW posts
    const posts = body.data.children.filter(post => !post.data.over_18);

    // Check if there are any posts
    if (!posts.length) return message.reply(`No posts found in \`r/${subreddit}\`.`);

    const post = posts[Math.floor(Math.random() * posts.length)].data;

    // Create embed
    const embed = new Discord.MessageEmbed({
      color: global.config.colors.default,
      title: `r/${subreddit} ${post.title}`,
      url: `https://reddit.com${post.permalink}`,
      fields: [
        { name: "Author:", value: `\`${post.author}\``, inline: true },
        { name: "Score:", value: post.score, inline: true }
      ]
    });

    if (post.selftext) embed.setDescription(entities.decodeHTML(post.selftext));
    if (post.url.endsWith(".jpg") || post.url.endsWith(".png")) embed.setImage(post.url);

    return message.reply(embed);
  }
};