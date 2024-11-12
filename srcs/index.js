const cron = require('node-cron');
const { Client, Events, GatewayIntentBits } = require("discord.js"); // Require the necessary discord.js classes
const displayLocations = require("./displayLocations.js");
const searchLogin = require("./searchLogin.js");
const { secretNotification } = require('./secretNotification.js');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", searchLogin);

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);

  // Schedule a daily check at 3:00 PM server time
  cron.schedule('0 15 * * *', () => secretNotification(client));

  // Announce that client is ready in a discord channel
  const channel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
  if (channel) {
    channel.send(`Logged in as ${client.user.tag}`);
  }

  // Launch Logged users tracking loop
  setInterval(displayLocations, 30000, client);

  // Set client activity
  client.user.setActivity("in development");
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
