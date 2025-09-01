import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { MessageFlags } from 'discord.js';
import db from '../database.js';
import { checkBotPresenceAndPermissions, MESSAGES } from "../commandsUtils.js";

export const data = new SlashCommandBuilder()
    .setName('listlogins')
    .setDescription('List all tracked logins in this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const channel = interaction.channel;
  const channelID = channel.id;

  try {
    const botCheck = await checkBotPresenceAndPermissions(interaction, channel);
    if (!botCheck.success) return interaction.reply({ content: botCheck.message, flags: MessageFlags.Ephemeral });

    const channelExisted = await db.valueExists('channels', 'channelID', channelID);
    if (!channelExisted) return interaction.reply({ content: MESSAGES.ERRORS.CHANNEL_NOT_FOUND(channelID), flags: MessageFlags.Ephemeral });

    const trackedLogins = db.prepare("SELECT login FROM tracked WHERE channelID = ? ORDER BY login").all(channelID);

    if (trackedLogins.length === 0) {
      return interaction.reply({ content: 'No logins are currently tracked in this channel.', flags: MessageFlags.Ephemeral });
    }

    const embed = new EmbedBuilder()
      .setTitle(`Tracked Logins in #${channel.name}`)
      .setDescription(`**${trackedLogins.length}** login(s) tracked:\n\n${trackedLogins.map(row => `• \`${row.login}\``).join('\n')}`)
      .setColor(0x00AE86)
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
  catch (error) {
    return interaction.reply({ content: MESSAGES.ERRORS.GENERIC('listlogins'), flags: MessageFlags.Ephemeral });
  }
}