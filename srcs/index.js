async function main() {
	// Require the necessary discord.js classes
	const { Client, Events, GatewayIntentBits } = require('discord.js');

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
		const channel = client.channels.cache.get('1276305483333898291');
		if (channel) {
			const message = await channel.send('initial message');
			message.edit("edited message");
		}
	});

	// Log in to Discord with your client's token
	await client.login(process.env.DISCORD_TOKEN);

	client.user.setActivity('Stalking you...');
}

main();
