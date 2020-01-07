module.exports = {
    name: 'os-info',
    description: 'Returns information about the host OS.',
    aliases: ['os'],
    async execute(client, message, args) {
        const os = require('os');
        return message.channel.send(new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('OS Information')
            .addField('Platform', os.platform(), true)
            .addField('Architecture', os.arch(), true)
            .addField('System Uptime', client.moment(os.uptime() * 1000).format('HH:mm:ss'), true)
            .addField('Release', os.release(), true)
            .addField('Hostname', os.hostname(), true)
            .addField('Home Directory', os.homedir(), true)
            .addField('Free Memory', `${(os.freemem() / 1e+9).toFixed(2)} GB`, true)
            .addField('Total Memory', `${(os.totalmem() / 1e+9).toFixed(2)} GB`, true)
            .addField('Version', process.version, true)
            .addField('Node Uptime', client.moment(process.uptime() * 1000).format('HH:mm:ss'), true)
            .addField('Load Average (1 min)', os.loadavg()[0].toFixed(2), true)
            .addField('CPU', os.cpus()[0].model, true));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3MtaW5mby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9vcy1pbmZvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZixJQUFJLEVBQUUsU0FBUztJQUNmLFdBQVcsRUFBRSx3Q0FBd0M7SUFDckQsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQ2YsS0FBSyxDQUFDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7UUFDbEMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTthQUMxRCxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7YUFDbEMsUUFBUSxDQUFDLGdCQUFnQixDQUFDO2FBQzFCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQzthQUN6QyxRQUFRLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUM7YUFDekMsUUFBUSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDO2FBQ3JGLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQzthQUN2QyxRQUFRLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUM7YUFDekMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUM7YUFDOUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQzthQUN2RSxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO2FBQ3pFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7YUFDMUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDO2FBQ3hGLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQzthQUNsRSxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQyJ9