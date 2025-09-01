import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { MessageFlags } from 'discord.js';
import db from '../database.js';
import { checkBotPresenceAndPermissions, MESSAGES } from "../commandsUtils.js";

export const data = new SlashCommandBuilder()
    .setName('trackchannel')
    .setDescription('Add the channel to the database to track login.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const channel = interaction.channel;
  const channelID = channel.id;

  try {
    const botCheck = await checkBotPresenceAndPermissions(interaction, channel);
    if (!botCheck.success) return interaction.reply({ content: botCheck.message, flags: MessageFlags.Ephemeral });

    const result = db.addValue('channels', 'channelID', channelID);
    if (!result.success) return interaction.reply({ content: MESSAGES.ERRORS.CHANNEL_ALREADY_TRACKED(channelID), flags: MessageFlags.Ephemeral });

    return interaction.reply({ content: MESSAGES.SUCCESS.CHANNEL_TRACK(channelID), flags: MessageFlags.Ephemeral });
  }
  catch (error) {
    return interaction.reply({ content: MESSAGES.ERRORS.GENERIC('trackchannel'), flags: MessageFlags.Ephemeral });
  }
}