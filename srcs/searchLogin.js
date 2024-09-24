const { api42 } = require("./apiInterface.js");
const { getProfileEmbed } = require("./getProfileEmbed.js");

// Search login and display an embed message in any channel with tag <login>@42
async function searchLogin(message) {
	if (message.author.bot)
		return;
	message.content = message.content.toLowerCase();
	let match = message.content.match(/[a-z0-9-]+@42/g)
	if (!match)
		return;
	for (let login of match) {
		login = login.slice(0, login.length - 3);
		try {
			const user = await api42.getUser(login);
			await message.reply({ embeds: [getProfileEmbed(user)] });
		} catch (err) {
			if (!err.rawError)
				message.reply(`\`${login}\` : login not found`).catch(() => {});
		}
	}
}

module.exports = searchLogin;
