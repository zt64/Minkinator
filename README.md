# Minkinator, another Discord bot.

## Requirements

* Node v12.16 or newer
* NPM v6.14 or newer
* Discord bot token
* DarkSky API key

## Setup

After cloning the repository you must run `npm install` in your terminal before starting the bot.
You will also need a bot token and a DarkSky API key.

Create a file called `keys.json` in the `/src/config/`, and paste the tokens in their respective places.
**Do not** share these keys with anyone, it can be a severe vulnerability.

```json
{
  "token": "botToken",
  "darkSky": "darkSkyToken"
}
```

To start the bot run `node .` inside of the `/src/` directory.

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Litleck/Minkinator-Bot/issues).

## License

Copyright © 2020 [Nicholas Owens](https://github.com/Litleck). <br>
This project is [MIT](https://github.com/Litleck/Minkinator-Bot/blob/master/LICENSE) licensed.
