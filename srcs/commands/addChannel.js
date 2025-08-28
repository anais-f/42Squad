import { SlashCommandBuilder } from 'discord.js';
import db from '../database.js';
import { checkPermissions, checkBotPresence} from "../commandsCheck.js";

export const data = new SlashCommandBuilder()
    .setName('addchannel')
    .setDescription('Add a channel to the database.')
    .addStringOption(option =>
        option.setName('channelid')
            .setDescription('The ID of the channel to add (numeric only).')
            .setRequired(true)
    );

export async function execute(interaction) {
  const channelID = interaction.options.getString('channelid');

  try {
    const permissionCheck = await checkPermissions(interaction);
    if (!permissionCheck.success) return interaction.reply({ content: permissionCheck.message, flags: 64 });

    const botPresenceCheck = await checkBotPresence(interaction, channelID);
    if (!botPresenceCheck.success) return interaction.reply({ content: botPresenceCheck.message, flags: 64 });

    const channelExists = await interaction.client.channels.fetch(channelID);
    if (!channelExists) {
      return interaction.reply({ content: 'Channel not found.', flags: 64 });
    }

    if (await db.valueExists('channels', 'channelID', channelID))
      return interaction.reply({ content: 'Channel is already in the database.', flags: 64 });

    await db.addValue('channels', 'channelID', channelID);
    return interaction.reply({ content: `Channel <#${channelID}> added to the database.`, flags: 64 });

  }
  catch (error) {
    console.error('Error adding channel:', error);
    return interaction.reply({ content: 'There was an error while executing this command.', flags: 64 });
  }
}