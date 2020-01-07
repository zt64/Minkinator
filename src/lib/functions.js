exports.convertTime = (time) => {
  const map = new Map([['s', 1000], ['m', 6e+4], ['h', 3.6e+6], ['d', 8.64e+7], ['w', 6.048e+8], ['M', 2.628e+9], ['y', 3.154e+10], ['D', 3.154e+11], ['c', 3.154e+12]]);
  let mem = '';
  let ms = 0;

  time = time.split('');

  for (const item of time) {
    if (isNaN(item)) {
      ms += parseInt(mem) * map.get(item);
      mem = '';
    } else {
      mem += item;
    }
  }

  return ms;
};

exports.randomInteger = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

exports.getUser = async (client, message, string) => {
  try {
    console.log(await client.users.fetch(string));
  } catch (e) {
    console.log(e);
  };

  try {
    console.log(message.mentions.first());
  } catch (e) {
    console.log(e);
  };

  try {
    console.log(message.author);
  } catch (e) {
    console.log(e);
  };
};