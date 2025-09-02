import { SlashCommandBuilder, MessageFlags } from 'discord.js';
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
  await interaction.deferReply();

  const login = interaction.options.getString('login').toLowerCase();
  const channel = interaction.channel;

  if (!/^[a-z0-9-]+$/.test(login))
    return interaction.editReply({ content: MESSAGES.ERRORS.INVALID_LOGIN_FORMAT, flags: MessageFlags.Ephemeral });

  try {
    const botCheck = await checkBotPresenceAndPermissions(interaction, channel);
    if (!botCheck.success)
      return interaction.editReply({ content: botCheck.message, flags: MessageFlags.Ephemeral });

    try {
      const user = await api42.getUser(login);
      const embed = getProfileEmbed(user);
      return interaction.editReply({ embeds: [embed] });
    }
    catch (errorApi) {
      console.error('API Error: ', errorApi);
      if (errorApi.message && errorApi.message.includes('404'))
        return interaction.editReply({ content: MESSAGES.ERRORS.LOGIN_NOT_FOUND_API(login), flags: MessageFlags.Ephemeral });
      return interaction.editReply({ content: MESSAGES.ERRORS.API_ERROR, flags: MessageFlags.Ephemeral });
    }
  }
  catch (error) {
    console.error('Generic Command Error: ', error);
    return interaction.editReply({ content: MESSAGES.ERRORS.GENERIC('search'), flags: MessageFlags.Ephemeral });
  }
}