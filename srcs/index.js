import pkg from 'discord.js';
import { loadCommands } from './handlers/commandHandler.js';
import { registerEvents } from './handlers/eventHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const { Client, Collection, GatewayIntentBits } = pkg;

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables and validate them
const intervalSeconds = parseInt(process.env.INTERVAL_SECONDS, 10);
if (isNaN(intervalSeconds) || intervalSeconds <= 0) {
  console.error("INTERVAL_SECONDS must be a positive integer.");
  process.exit(1);
}

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Attach and load commands to the client
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
await loadCommands(client, commandsPath);

// Register all client events
registerEvents(client, intervalSeconds);

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
