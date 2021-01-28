

# Minkinator, another Discord bot. ![GitHub](https://img.shields.io/github/license/litleck/minkinator) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/litleck/minkinator) ![Discord](https://img.shields.io/badge/discord-rXVnuTB-6666ee?logo=discord)

## Requirements
* [Node v12.16 or newer](https://nodejs.org/en/download/)
* [Discord bot token](https://discord.com/developers/applications)

## Setup
To get started, clone this repository using `git clone https://github.com/Litleck/Minkinator.git`.
After that step navigate to the bots install directory and run `npm install` in your terminal before starting the bot.
It can be difficult getting some packages such as [Canvas](https://www.npmjs.com/package/canvas), and [SQLite3](https://www.npmjs.com/package/sqlite3). It's best to follow the guides for installing them on their npm pages as they already have detailed guides on installing them.

For the voice features of the bot to work FFmpeg is required, on Linux it can be installed with most package managers. For Windows it is a bit more difficult.

You will need a bot token to be able to use the Discord API. Some commands also depend on external APIs which require their own authentication.

Navigate to the `src` directory and open the file `config.template.json`. This file contains the configuration and authentication tokens that the bot makes use of. It is recommended to fill out each of the keys with their proper value, but the bot will function mostly with just a Discord token.
**Do not** share these keys with anyone, it can be a severe vulnerability.

To start the bot use either `npm start` or `node .` in the root directory.

## Contributing
Contributions, issues and feature requests are welcome!<br />Feel free to check the [issues page](https://github.com/Litleck/Minkinator-Bot/issues) if you have anything to contribute.

## License
Copyright © 2021 [Nicholas Owens](https://github.com/Litleck). <br>
This project is [MIT](https://github.com/Litleck/Minkinator-Bot/blob/master/LICENSE) licensed.
