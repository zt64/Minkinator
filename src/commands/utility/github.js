const prettyBytes = require("pretty-bytes");
const moment = require("moment");

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
      async execute (client, message, [ owner, name ]) {
        const { colors } = global.guildInstance.config;

        const json = await util.fetchJSON(`https://api.github.com/repos/${owner}/${name}`);
        
        if (json.message === "Not Found") return message.channel.send("Could not find repository.");

        const commits = await util.fetchJSON(`https://api.github.com/repos/${owner}/${name}/commits`);
        const pulls = await util.fetchJSON(`https://api.github.com/repos/${owner}/${name}/pulls`);

        // Create embed
        const embed = new Discord.MessageEmbed({
          color: colors.default,
          title: json.full_name,
          url: json.html_url,
          fields: [
            { name: "ID:", value: json.id, inline: true },
            { name: "Language:", value: json.id, inline: true },
            { name: "Size:", value: prettyBytes(json.size * 1000), inline: true },
            { name: "Watchers:", value: json.watchers, inline: true },
            { name: "Forks:", value: json.forks, inline: true },
            { name: "Pull Requests:", value: pulls.length, inline: true },
            { name: "Issues:", value: json.open_issues, inline: true },
            { name: "Commits:", value: commits.length, inline: true },
            { name: "License:", value: json.license.name, inline: true },
            { name: "Created:", value: moment(json.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a") },
            { name: "Updated:", value: moment(json.updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a") }
          ]
        });

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
      async execute (client, message, [ user ]) {
        const { colors } = global.guildInstance.config;

        const json = await util.fetchJSON(`https://api.github.com/users/${user}`);

        if (json.message === "Not Found") return message.channel.send("Could not find user.");

        // Create embed
        const embed = new Discord.MessageEmbed({
          color: colors.default,
          title: json.login,
          url: json.html_url,
          fields: [
            { name: "Location:", value: json.location, inline: true },
            { name: "Hireable:", value: json.hireable ? "True" : "False", inline: true },
            { name: "Public Repositories:", value: json.public_repos, inline: true },
            { name: "Public Gists:", value: json.public_gists, inline: true },
            { name: "Followers:", value: json.followers, inline: true },
            { name: "Following:", value: json.following, inline: true },
            { name: "Created:", value: moment(json.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a") }
          ]
        });

        if (json.bio) embed.setDescription(json.bio);
        if (json.name) embed.addField("Name:", json.name, true);
        if (json.company) embed.addField("Company:", json.company, true);
        if (json.blog) embed.addField("Website:", json.blog, true);

        return message.channel.send(embed);
      }
    }
  ]
};
