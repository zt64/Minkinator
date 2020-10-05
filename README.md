![GitHub](https://img.shields.io/github/license/litleck/minkinator)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/litleck/minkinator)
![Discord](https://img.shields.io/badge/discord-rXVnuTB-6666ee?logo=discord)

# Minkinator, another Discord bot.

## Requirements
* [Node v12.16 or newer](https://nodejs.org/en/download/)
* [Discord bot token](https://discord.com/developers/applications)
* [DarkSky API key](https://darksky.net/dev)

## Setup
To get started, clone this repository using `git clone https://github.com/Litleck/Minkinator.git`.
After cloning run `npm install` in your terminal before starting the bot.
It can be difficult getting some packages such as [Canvas](https://www.npmjs.com/package/canvas), and [SQLite3](https://www.npmjs.com/package/sqlite3). It's best to follow the guides for installing them on their npm pages as they already have detailed guides on installing them.

For the voice features of the bot to work FFmpeg is required, on Linux it can be installed with most package managers. For Windows it is a bit more difficult.

You will need a bot token to be able to use the Discord API. Some commands also depend on external APIs, being Open Weather Map and Mapbox.

Create a file called `auth.json` in the `/src/config/`, and paste the tokens in their respective places.
**Do not** share these keys with anyone, it can be a severe vulnerability.

```json
{
  "discord": "tokenHere",
  "openWeatherMap": "keyHere",
  "mapbox": "keyHere"
}
```

To start the bot run `node .` inside of the `/src/` directory.

## Contributing
Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Litleck/Minkinator-Bot/issues).

## License
Copyright © 2020 [Nicholas Owens](https://github.com/Litleck). <br>
This project is [MIT](https://github.com/Litleck/Minkinator-Bot/blob/master/LICENSE) licensed.
