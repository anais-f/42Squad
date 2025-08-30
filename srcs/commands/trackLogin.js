import { SlashCommandBuilder } from 'discord.js';
import { MessageFlags } from 'discord.js';
import db from '../database.js';
import { checkUserPermissions, checkBotPresenceAndPermissions} from "../commandsCheck.js";

export const data = new SlashCommandBuilder()
    .setName('tracklogin')
    .setDescription('Add a login to the database to track it in this channel.')
    .addStringOption(option =>
        option.setName('tracklogin')
          .setDescription('Add the login to the DB to track it in this channel.')
          .setRequired(true)
          .setMaxLength(8)
    );

// channelID, login
// checker si le login existe via l'api
// checker si le login est deja dans la db students -> si non ajouter le login
// checker si le login est deja dans la db channels_logins pour ce channel -> si non l'ajouter

export async function execute(interaction) {
  const channel = interaction.channel;
  const channelID = channel.id;

  try {
    const botCheck = await checkBotPresenceAndPermissions(interaction, channel);
    if (!botCheck.success) return interaction.reply({ content: botCheck.message, flags: MessageFlags.Ephemeral });

    const userPermissionsCheck = await checkUserPermissions(interaction, channel);
    if (!userPermissionsCheck.success) return interaction.reply({ content: userPermissionsCheck.message, flags: MessageFlags.Ephemeral });

    const channelInDb = await db.valueExists('channels', 'channelID', channelID)
    if (!channelInDb) return interaction.reply({ content: channelInDb.message, flags: MessageFlags.Ephemeral });

    // await db.addValue('channels', 'channelID', channelID);
    // return interaction.reply({ content: `Channel <#${channelID}> added to the database.`, flags: MessageFlags.Ephemeral });
  }
  catch (error) {
    console.error('Error adding channel:', error);
    return interaction.reply({ content: 'There was an error while executing tracklogin command.', flags: MessageFlags.Ephemeral });
  }
}