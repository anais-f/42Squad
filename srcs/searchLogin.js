const { api42 } = require("./apiInterface.js");
const { getProfileEmbed } = require("./getProfileEmbed.js");

// Search login and display an embed message in any channel with tag <login>@42
async function searchLogin(message) {
	if (message.author.bot)
		return;
	let match = message.content.match(/[a-z0-9-]+@42+($|\s)/ig)
	if (!match)
		return;
	const sent = [];
	for (let login of match) {
		login = login.match(/[a-z0-9-]+/i);
		if (sent.length >= 5) {
			break;
		} else if (login[0].length > 8 || sent.find(e => e == login)) {
			continue;
		}
		login = login[0].toLowerCase();
		try {
			const user = await api42.getUser(login);
			await message.reply({ embeds: [getProfileEmbed(user)] });
			sent.push(login);
		} catch (err) {
			if (!err.rawError)
				message.reply(`\`${login}\` : login not found`).catch(() => {});
		}
	}
}

module.exports = searchLogin;
