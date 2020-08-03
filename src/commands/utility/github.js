module.exports = {
  description: "Allows usage of the github API.",
  subCommands: [
    {
      name: "repo",
      parameters: [
        {
          name: "name",
          type: String,
          required: true
        },
        {
          name: "repo",
          type: String,
          required: true
        }
      ]
    },
    {
      name: "user",
      parameters: [
        {
          name: "name",
          type: String,
          required: true
        }
      ]
    }
  ],
  parameters: [
    {
      name: "repo",
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const subCommand = args[0];
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;

    const embed = new client.Discord.MessageEmbed()
      .setColor(successColor);

    const fetchJson = async url => await (await client.fetch(url)).json();

    if (subCommand === "repo") {
      const owner = args[1];
      const repo = args[2];

      const json = await fetchJson(`https://api.github.com/repos/${owner}/${repo}`);
      const commits = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/commits`);
      const pulls = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/pulls`);

      if (json.message === "Not Found") return message.channel.send("Could not find repository.");

      embed.setTitle(json.full_name);
      embed.setURL(json.html_url);
      embed.addField("ID:", json.id, true);
      embed.addField("Language:", json.language, true);
      embed.addField("Size:", `${json.size / 1000}MB`, true);
      embed.addField("Watchers:", json.watchers, true);
      embed.addField("Forks:", json.forks, true);
      embed.addField("Pull Requests:", pulls.length);
      embed.addField("Issues:", json.open_issues, true);
      embed.addField("Commits:", commits.length);
      embed.addField("License:", json.license.name);
      embed.addField("Created:", client.moment(json.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a"));
      embed.addField("Updated:", client.moment(json.updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a"));

      if (json.description) embed.setDescription(json.description);
    }

    if (subCommand === "user") {
      const user = args[1];

      const json = await fetchJson(`https://api.github.com/users/${user}`);

      if (json.message === "Not Found") return message.channel.send("Could not find user.");

      embed.setTitle(json.login);
      embed.setURL(json.html_url);

      if (json.name) embed.addField("Name:", json.name, true);
      if (json.company) embed.addField("Company:", json.company, true);
      if (json.blog) embed.addField("Website:", json.blog, true);

      embed.addField("Location:", json.location, true);
      embed.addField("Hireable:", json.hireable ? "True" : "False", true);
      embed.addField("Public Repositories:", json.public_repos, true);
      embed.addField("Public Gists:", json.public_gists, true);
      embed.addField("Followers:", json.followers);
      embed.addField("Following:", json.following, true);
      embed.addField("Created:", client.moment(json.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a"));
      embed.addField("Updated:", client.moment(json.updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a"));

      if (json.bio) embed.setDescription(json.bio);

      console.log(json);
    }

    return message.channel.send(embed);
  }
};