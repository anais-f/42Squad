const { api42 } = require("./apiInterface.js");
const { getProfileEmbed } = require("./getProfileEmbed.js");

// Search login and display an embed message in any channel with tag <login>@42
async function searchLogin(message) {
	if (message.author.bot) return;
	const index_end = message.content.search("@42");
	if (index_end === -1 || index_end === 0) return;
	let index = index_end - 1;
	message.content = message.content.toLowerCase();
	while (index > 0 && message.content[index - 1] != " ") index--;
	const login = message.content.slice(index, index_end);
	try {
		const user = await api42.getUser(login);
		await message.reply({ embeds: [getProfileEmbed(user)] });
	} catch (err) {
		if (!err.rawError)
			message.reply(`\`${login}\` : login not found`).catch(() => {});
	}
}

module.exports = searchLogin;