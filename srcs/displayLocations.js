const { EmbedBuilder } = require('discord.js');
const { api42 } = require("./apiInterface.js");

const tracking = [
	{login: "acancel", host: null},
	{login: "anfichet", host: null},
	{login: "bwisniew", host: null},
	{login: "cdomet-d", host: null},
	{login: "csweetin", host: null},
	{login: "ibertran", host: null},
	{login: "kchillon", host: null},
	{login: "lcottet", host: null},
	{login: "lrio", host: null},
	{login: "mjuffard", host: null},
	{login: "talibert", host: null}
]

async function trackLocation() {
	const usersLocation = await api42.getCampusLocations(9, true);
	tracking.forEach((user) => {
		const trackUser = usersLocation.find(loginUser => loginUser.user.login === user.login);
		if (trackUser) {
			user.host = trackUser.host;
		} else {
			user.host = null;
		}
	});
	return (tracking);
}

let lastMessage;

async function displayLocations(client) {
	try {
		let locations = await trackLocation();
		locations = locations.filter((element) => element.host);
		locations.sort((a, b) => a.host.localeCompare(b.host));
	
		const embed = new EmbedBuilder()
		.setColor("#00ecef")
		.setDescription("## 🪿 Currently logged in");
		locations.forEach((element) => {
			embed.addFields({
				name: `\`${element.login.padEnd(8, " ")}\` 📍`,
				value: "⤷" + "`" + element.host + "`",
				inline: true,
			});
		});
	
		  const channelAnnounceId = client.channels.cache.get(process.env.TRACK_CHANNEL);
		  if (channelAnnounceId) {
			if (!lastMessage) {
				lastMessage = await channelAnnounceId.send({ embeds: [embed] })
				.catch(error => {
					console.error(`Error senting message: ${error.rawError.message}`)
				});
			} else {
				lastMessage.edit({ embeds: [embed] })
				.catch(async error => {
					lastMessage = await channelAnnounceId.send({ embeds: [embed] });
				})
			}
		  };
	} catch (error) {
		console.error(error);
	}
}

module.exports = displayLocations;