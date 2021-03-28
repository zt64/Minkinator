const { PythonShell } = require("python-shell");
const fetch = require("node-fetch");
const moment = require("moment");

exports.convertTime = (time) => {
  const map = new Map([["s", 1000], ["m", 6e+4], ["h", 3.6e+6], ["d", 8.64e+7], ["w", 6.048e+8], ["M", 2.628e+9], ["y", 3.154e+10], ["D", 3.154e+11], ["c", 3.154e+12]]);
  let mem = "";
  let ms = 0;

  time = time.split("");

  for (const item of time) {
    if (isNaN(item)) {
      ms += parseInt(mem) * map.get(item);
      mem = "";
    } else {
      mem += item;
    }
  }

  return ms;
};

exports.randomInteger = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

exports.getUser = async (client, message, idArg) => {
  if (message.mentions.users.size) return message.mentions.users.first();

  if (idArg) {
    try {
      return client.users.fetch(idArg);
    } catch (error) {
      return;
    }
  }

  return message.author;
};

exports.kToC = (k) => {
  return (k - 273.15).toFixed(2);
};

exports.cToK = (c) => {
  return c + 273.15;
};

exports.cToF = (c) => {
  return (c * 1.8) + 32;
};

exports.fToC = (f) => {
  return (f - 32) / 1.8;
};

exports.capitalize = (string) => {
  if (typeof (string) !== "string") return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

exports.formatNumber = (number, places = 0) => {
  return (number).toFixed(places).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

exports.fetchJSON = async (url, options) => {
  const response = await fetch(url, options);

  return response.json();
};

exports.paginate = (items, size, page) => {
  return items.slice((page - 1) * size, page * size);
};

exports.time = (format = "HH:mm M/D/Y") => {
  return moment().format(format);
};

exports.generateSentence = async (data) => {
  const pyshell = new PythonShell(`${__basedir}/util/markov.py`, {
    mode: "text"
  });

  let stdout = "";

  pyshell.send(data);

  return new Promise((resolve, reject) => {
    // Send strings to python script
    pyshell.on("message", (string) => {
      stdout += string;
    });

    pyshell.end((err) => {
      if (err) reject(err);
      resolve(stdout);
    });
  });
};

exports.hasPermission = (member, command) => {
  if (member.user.id !== global.config.ownerID) {
    if (command.ownerOnly || !member.permissions.has(command.permissions)) return false;
  }

  return true;
};