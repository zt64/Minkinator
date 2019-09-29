module.exports = {
  name: 'reddit',
  description: 'Retrieves an image from a subreddit.',
  usage: '[subreddit]',
  aliases: ['rdt'],
  args: true,
  async execute (client, message, args) {
    const { body } = await client.snekfetch
      .get(`https://www.reddit.com/r/${args[0]}.json?sort=top&t=week`)
      .query({ limit: 8192 });

    const posts = body.data.children.filter(post => !post.data.over_18 && (post.data.url || post.data.link_url));

    if (!posts.length) return message.channel.send('Unable to find any results.');

    const random = Math.floor(Math.random() * posts.length);
    const post = posts[random];

    message.channel.send(new client.discord.RichEmbed()
      .setColor('#34eb3d')
      .setTitle(post.data.link_title || post.data.title)
      .setDescription('Posted by: ' + post.data.author)
      .setImage(post.data.link_url || post.data.url));
  }
};
