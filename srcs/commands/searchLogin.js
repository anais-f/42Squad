import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { MessageFlags } from 'discord.js';
import { api42 } from "../apiInterface.js";
import { getProfileEmbed } from "../getProfileEmbed.js";

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

  if (!/^[a-z0-9-]+$/.test(login)) {
    return interaction.reply({
      content: 'Invalid login format. Only letters, numbers, and hyphens are allowed.',
      flags: MessageFlags.Ephemeral
    });
  }

    try {
        const user = await api42.getUser(login);
        return interaction.reply({ embeds: [getProfileEmbed(user)] });
    } catch (error) {
        if (!error.rawError) {
            return interaction.reply({
                content: `\`${login}\` : login not found`,
                flags: MessageFlags.Ephemeral
            });
        }
        return interaction.reply({
            content: 'An error occurred while searching for the user.',
            flags: MessageFlags.Ephemeral
        });
    }
}