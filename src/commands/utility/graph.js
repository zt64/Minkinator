const Chart = require("chart.js");
const math = require("mathjs");

module.exports = {
  description: "Draw a mathematical equation.",
  async execute (client, message, args) {
    const expr = math.compile("4 * sin(x) + 5 * cos(x/2)");

    // evaluate the expression repeatedly for different values of x
    const xValues = math.range(-10, 10, 0.5).toArray();
    const yValues = xValues.map(function (x) {
      return expr.evaluate({ x: x });
    });

    const canvas = global.canvas.createCanvas(512, 512);
    const ctx = canvas.getContext("2d");

    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

    const attachment = new global.Discord.MessageAttachment(canvas.toBuffer());

    return message.channel.send(attachment);
  }
};