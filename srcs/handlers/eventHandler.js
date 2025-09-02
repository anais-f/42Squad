import { Events, MessageFlags, PermissionFlagsBits } from 'discord.js';
import searchLogin from '../searchLogin.js';
import displayLocations from '../displayLocations.js';
import { secretNotification } from '../secretNotification.js';
import cron from 'node-cron';

/**
 * Registers all client event listeners.
 * @param {import('discord.js').Client} client The Discord client instance.
 * @param {number} intervalSeconds The interval for location tracking.
 */
export function registerEvents(client, intervalSeconds) {
  // Interaction listener for slash commands
  client.on(Events.InteractionCreate, async interaction => {
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
  client.on(Events.MessageCreate, searchLogin);

  // When the client is ready, run this code (only once).
  client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);

    // Schedule a daily check at 3:00 PM server time
    cron.schedule('0 15 * * *', () => secretNotification(client));

    // Announce that client is ready in a discord channel
    const channel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
    if (channel)
      channel.send(`Logged in as ${client.user.tag}`);

    // Launch Logged users tracking loop
    setInterval(displayLocations, intervalSeconds * 1000, client);

    // Set client activity
    client.user.setActivity("in development");
  });
}
