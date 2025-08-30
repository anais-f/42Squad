import { SlashCommandBuilder } from 'discord.js';
import { MessageFlags } from 'discord.js';
import db from '../database.js';
import { checkUserPermissions, checkBotPresenceAndPermissions} from "../commandsCheck.js";

export const data = new SlashCommandBuilder()
    .setName('untracklogin')
    .setDescription('Add a login to the database to track it in this channel.')
    .addStringOption(option =>
        option.setName('untracklogin')
            .setDescription('Remove the login to the DB to track it in this channel.')
            .setRequired(true)
            .setMaxLength(8)
    );

export async function execute(interaction) {
  const channel = interaction.channel;
  const channelID = channel.id;
  const login = interaction.options.getString('untracklogin').toLowerCase();

  try {
    const botCheck = await checkBotPresenceAndPermissions(interaction, channel);
    if (!botCheck.success) return interaction.reply({ content: botCheck.message, flags: MessageFlags.Ephemeral });

    const userPermissionsCheck = await checkUserPermissions(interaction, channel);
    if (!userPermissionsCheck.success) return interaction.reply({ content: userPermissionsCheck.message, flags: MessageFlags.Ephemeral });

    const channelExisted = await db.valueExists('channels', 'channelID', channelID)
    if (!channelExisted) return interaction.reply({ content: `Channel <#${channel.name}> does not exist in the database.`, flags: MessageFlags.Ephemeral });

    const loginExisted = db.prepare("SELECT 1 FROM tracked WHERE channelID = ? AND login = ?").get(channelID, login);
    if (loginExisted) {
      const result = db.prepare("DELETE FROM tracked WHERE channelID = ? AND login = ?");
      result.run(channelID, login);
      return interaction.reply({ content: `Login ${login} delete in the database.`, flags: MessageFlags.Ephemeral });
    }
    else
      return interaction.reply({ content: `Login ${login} does not exist in the database.`, flags: MessageFlags.Ephemeral });
  }
  catch (error) {
    console.error('Error adding channel:', error);
    return interaction.reply({ content: 'There was an error while executing tracklogin command.', flags: MessageFlags.Ephemeral });
  }
}