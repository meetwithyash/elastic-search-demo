const { Dropbox } = require("dropbox");

const dropbox = new Dropbox({
	accessToken: process.env.DROPBOX_TOKEN,
});

module.exports = dropbox;
