module.exports = {
  description: "Allows usage of the GitHub API.",
  subCommands: [
    {
      name: "repo",
      description: "Get information on a GitHub repository.",
      parameters: [
        {
          name: "owner",
          type: String,
          required: true
        },
        {
          name: "name",
          type: String,
          required: true
        }
      ],
      async execute (client, message, args) {
        const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
        const defaultColor = guildConfig.colors.default;

        const owner = args[0];
        const name = args[1];

        const fetchJson = async url => await (await client.fetch(url)).json();

        // Fetch JSON results
        const json = await fetchJson(`https://api.github.com/repos/${owner}/${name}`);
        const commits = await fetchJson(`https://api.github.com/repos/${owner}/${name}/commits`);
        const pulls = await fetchJson(`https://api.github.com/repos/${owner}/${name}/pulls`);

        if (json.message === "Not Found") return message.channel.send("Could not find repository.");

        // Create embed
        const embed = new client.Discord.MessageEmbed()
          .setColor(defaultColor)
          .setTitle(json.full_name)
          .setURL(json.html_url)
          .addField("ID:", json.id, true)
          .addField("Language:", json.language, true)
          .addField("Size:", `${json.size / 1000}MB`, true)
          .addField("Watchers:", json.watchers, true)
          .addField("Forks:", json.forks, true)
          .addField("Pull Requests:", pulls.length)
          .addField("Issues:", json.open_issues, true)
          .addField("Commits:", commits.length)
          .addField("License:", json.license.name)
          .addField("Created:", client.moment(json.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a"))
          .addField("Updated:", client.moment(json.updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a"));

        if (json.description) embed.setDescription(json.description);

        return message.channel.send(embed);
      }
    },
    {
      name: "user",
      description: "Get information on a GitHub user.",
      parameters: [
        {
          name: "name",
          type: String,
          required: true
        }
      ],
      async execute (client, message, args) {
        const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
        const defaultColor = guildConfig.colors.default;
        const user = args[0];

        const fetchJson = async url => await (await client.fetch(url)).json();

        const json = await fetchJson(`https://api.github.com/users/${user}`);

        if (json.message === "Not Found") return message.channel.send("Could not find user.");

        // Create embed
        const embed = new client.Discord.MessageEmbed()
          .setColor(defaultColor)
          .setTitle(json.login)
          .setURL(json.html_url)
          .addField("Location:", json.location, true)
          .addField("Hireable:", json.hireable ? "True" : "False", true)
          .addField("Public Repositories:", json.public_repos, true)
          .addField("Public Gists:", json.public_gists, true)
          .addField("Followers:", json.followers)
          .addField("Following:", json.following, true)
          .addField("Created:", client.moment(json.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a"))
          .addField("Updated:", client.moment(json.updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a"));

        if (json.bio) embed.setDescription(json.bio);

        if (json.name) embed.addField("Name:", json.name, true);
        if (json.company) embed.addField("Company:", json.company, true);
        if (json.blog) embed.addField("Website:", json.blog, true);

        return message.channel.send(embed);
      }
    }
  ]
};
