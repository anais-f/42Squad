import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';
import db from '../database.js';
import { checkBotPresenceAndPermissions, MESSAGES } from "../commandsUtils.js";

export const data = new SlashCommandBuilder()
    .setName('untracklogin')
    .setDescription('Stops tracking a login in this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('untracklogin')
            .setDescription('The login to stop tracking.')
            .setRequired(true)
            .setMaxLength(8)

    );

export async function execute(interaction) {
  const channel = interaction.channel;
  const channelID = channel.id;
  const login = interaction.options.getString('untracklogin').toLowerCase();

  if (!/^[a-z0-9-]+$/.test(login))
    return interaction.reply({ content: MESSAGES.ERRORS.INVALID_LOGIN_FORMAT, flags: MessageFlags.Ephemeral });

  try {
    const botCheck = await checkBotPresenceAndPermissions(interaction, channel);
    if (!botCheck.success)
      return interaction.reply({ content: botCheck.message, flags: MessageFlags.Ephemeral });

    const channelExisted = await db.valueExists('channels', 'channelID', channelID)
    if (!channelExisted)
      return interaction.reply({ content: MESSAGES.ERRORS.CHANNEL_NOT_FOUND(channelID), flags: MessageFlags.Ephemeral });

    const loginExisted = db.prepare("SELECT 1 FROM tracked WHERE channelID = ? AND login = ?").get(channelID, login);
    if (loginExisted) {
      db.prepare("DELETE FROM tracked WHERE channelID = ? AND login = ?").run(channelID, login);
      return interaction.reply({ content: MESSAGES.SUCCESS.LOGIN_UNTRACKED(login), flags: MessageFlags.Ephemeral });
    }
    else
      return interaction.reply({ content: MESSAGES.ERRORS.LOGIN_NOT_TRACKED(login), flags: MessageFlags.Ephemeral });
  }
  catch (error) {
    console.error('Generic Command Error: ', error);
    return interaction.reply({ content: MESSAGES.ERRORS.GENERIC("untracklogin"), flags: MessageFlags.Ephemeral });
  }
}