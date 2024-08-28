const {channel_id, login_id, message_id} = require('./config.js');
const {Api42} = require('../Api42.js/Api42.js');

const api42 = new Api42();

async function main() {
	// Require the necessary discord.js classes
	const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');

	// Create a new client instance
	const client = new Client({ intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	] });

	// When the client is ready, run this code (only once).
	client.once(Events.ClientReady, async (readyClient) => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
		
		// Write a message in a channel
		const channel = client.channels.cache.get(channel_id.testing);
		if (channel) {
			const message = await channel.send('initial message');
			//message.edit("edited message");
			channel.messages.fetch("1278344154736496731")
				.then(message => {
				message.edit("user reedition message post arret");
				});
		}
	});
	
	async function searchLogin(message) 
	{
		const index_end = message.content.search("@42");
		if (index_end === -1 || index_end === 0)
			return ;
		let index = index_end;
		index--;
		while (index > 0 && message.content[index - 1] != " ")
			index--;
		const login = message.content.slice(index, index_end);
		try {
			const user = await api42.getUser(login);
			const embed = new EmbedBuilder()
				.setTitle(user.login)
				.setURL(`https://profile.intra.42.fr/users/${user.login}`)
				.setImage(user.image.versions.medium)
				.setColor("#000000")
				.setFooter({
					text: "user",
					iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/768px-42_Logo.svg.png",
				})
				.setTimestamp();
			await message.reply({ embeds: [embed] });

		} catch {
			message.reply(`Login ${login} not found !`);
			return ;
		}
	}

	client.on("messageCreate", async message => {
		if (message.author.bot == false) {
			searchLogin(message);
		}
	});


	// Log in to Discord with your client's token
	await client.login(process.env.DISCORD_TOKEN);

	client.user.setActivity('Stalking you...');
}

main();