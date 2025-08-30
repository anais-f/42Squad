import { SlashCommandBuilder } from 'discord.js';
import { MessageFlags } from 'discord.js';
import db from '../database.js';
import { checkUserPermissions, checkBotPresenceAndPermissions} from "../commandsCheck.js";

export const data = new SlashCommandBuilder()
    .setName('trackchannel')
    .setDescription('Add the channel to the database to track login.');

export async function execute(interaction) {
  const channel = interaction.channel;
  const channelID = channel.id;

  try {
    const botCheck = await checkBotPresenceAndPermissions(interaction, channel);
    if (!botCheck.success) return interaction.reply({ content: botCheck.message, flags: MessageFlags.Ephemeral });

    const userPermissionsCheck = await checkUserPermissions(interaction, channel);
    if (!userPermissionsCheck.success) return interaction.reply({ content: userPermissionsCheck.message, flags: MessageFlags.Ephemeral });

    const result = db.addValue('channels', 'channelID', channelID);
    if (!result.success) return interaction.reply({ content: result.message, flags: MessageFlags.Ephemeral });

    return interaction.reply({ content: result.message, flags: MessageFlags.Ephemeral });
  }
  catch (error) {
    console.error('Error adding channel:', error);
    return interaction.reply({ content: 'There was an error while executing trackchannel command.', flags: MessageFlags.Ephemeral });
  }
}