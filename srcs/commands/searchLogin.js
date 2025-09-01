import { SlashCommandBuilder } from 'discord.js';
import { MessageFlags } from 'discord.js';
import { api42 } from "../apiInterface.js";
import { getProfileEmbed } from "../getProfileEmbed.js";
import { checkBotPresenceAndPermissions, MESSAGES } from "../commandsUtils.js";

export const data = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search for a 42 student profile.')
  .addStringOption(option =>
    option.setName('login')
      .setDescription('The login to search for')
      .setRequired(true)
      .setMaxLength(10)
  );

export async function execute(interaction) {
  const login = interaction.options.getString('login').toLowerCase();
  const channel = interaction.channel;

  if (!/^[a-z0-9-]+$/.test(login))
    return interaction.reply({ content: MESSAGES.ERRORS.INVALID_LOGIN_FORMAT, flags: MessageFlags.Ephemeral });

  const botCheck = await checkBotPresenceAndPermissions(interaction, channel);
  if (!botCheck.success) return interaction.reply({ content: botCheck.message, flags: MessageFlags.Ephemeral });

  try {
    const user = await api42.getUser(login);
    return interaction.reply({ embeds: [getProfileEmbed(user)] });
  }
  catch (error) {
    return interaction.reply({ content: MESSAGES.ERRORS.LOGIN_NOT_FOUND_API(login), flags: MessageFlags.Ephemeral });
  }
}