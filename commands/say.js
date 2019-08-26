module.exports = {
    name: "say",
    description: "Repeats a users input.",
    aliases: ["repeat"],
    usage: "[string]",
    adminOnly: true,
    args: true,
    async execute(client, message) {
        message.delete();

        message.channel.send(message.content.slice(5));       
    }
}