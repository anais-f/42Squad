import { api42 } from "./apiInterface.js";

export async function secretNotification(client) {
	await api42.getUser('ibertran');
	if (!api42.secretValidUntil) return;
	const currentDate = new Date();
    const daysUntilExpiration = Math.floor((new Date(api42.secretValidUntil * 1000) - currentDate) / (1000 * 60 * 60 * 24));
	if (daysUntilExpiration > 7) return;
	try {
		const user = await client.users.fetch(process.env.SECRET_OWNER_ID);
		await user.send(`⚠️ Your 42-API token will expire in ${daysUntilExpiration} day(s). Please update it soon.`);
	} catch (error) {
		console.error('Failed to send DM:', error);
	}
	const channel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
	if (channel) {
		channel.send(`⚠️ 42-API token will expire in ${daysUntilExpiration} day(s). Please update it soon.`);
	}
}
