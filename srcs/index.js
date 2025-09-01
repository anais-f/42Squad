import cron from 'node-cron';
import pkg from 'discord.js';
import displayLocations from "./displayLocations.js";
import searchLogin from "./searchLogin.js";
import { secretNotification } from './secretNotification.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const { Client, Collection, Events, GatewayIntentBits, PermissionFlagsBits, MessageFlags } = pkg;

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(filePath);
  client.commands.set(command.data.name, command);
}

// Interaction listener for slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  // Check permission to use commands
  const canUseCommands = interaction.member.permissions.has(PermissionFlagsBits.UseApplicationCommands);
  if (!canUseCommands) {
    return interaction.reply({ content: 'You don\'t have the required permissions to use this command.', flags: MessageFlags.Ephemeral });
  }

  // Execute command
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
  }
});

// Message listener for login search
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
  const intervalSeconds = parseInt(process.env.INTERVAL_SECONDS, 10);
  if (isNaN(intervalSeconds) || intervalSeconds <= 0) {
    console.error("INTERVAL_SECONDS must be a positive integer.");
    process.exit(1);
  }
  setInterval(displayLocations, intervalSeconds * 1000, client);

  // Set client activity
  client.user.setActivity("in development");
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
