module.exports = {
  name: 'sql',
  args: true,
  async execute (client, message, args) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('../database.sqlite');

    try {
      db.serialize(function () {
        db.run(args.join(' '));
      });
    } catch (e) {
      message.channel.send(e);
    }
  }
};
