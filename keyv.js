const Keyv = require('keyv');
const KeyvFile = require('keyv-file');

exports.keyv = new Keyv({
	store: new KeyvFile({
		filename: "./temp.json",
		expiredCheckDelay: 24 * 3600 * 1000,
		writeDelay: 100,
		encode: JSON.stringify,
		decode: JSON.parse
	})
})