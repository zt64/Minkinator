module.exports = {
  description: 'Get map of location.',
  async execute (client, message, args) {
    const Chart = require('chart.js');

    const canvas = client.canvas.createCanvas(512, 512);
    const ctx = canvas.getContext('2d');

    // var chart = new Chart(ctx, {
    //   // The type of chart we want to create
    //   type: 'line',

    //   // The data for our dataset
    //   data: {
    //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //     datasets: [{
    //       label: 'My First dataset',
    //       backgroundColor: 'rgb(255, 99, 132)',
    //       borderColor: 'rgb(255, 99, 132)',
    //       data: [0, 10, 5, 2, 20, 30, 45]
    //     }]
    //   },

    //   // Configuration options go here
    //   options: {}
    // });

    return message.channel.send(new client.Discord.MessageAttachment(canvas.toBuffer()));
  }
};