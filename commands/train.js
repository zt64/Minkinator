module.exports = {
  name: 'train',
  description: 'Retrains the dataset',
  execute (client, message, args) {
    client.net.train(require('../trainingData.json'), {
      log: true,
      logPeriod: 1,
      errorThresh: 0.011,
      iterations: 100
    });
  }
};
