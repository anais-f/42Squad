import { SlashCommandBuilder } from 'discord.js';
import db from "../database.js";
import { checkUserPermissions, checkBotPresenceAndPermissions} from "../commandsCheck.js";

export const data = new SlashCommandBuilder()
    .setName('untrackchannel')
    .setDescription('Delete the channel to the database to track login.');

export async function execute(interaction) {
  const channel = interaction.channel;
  const channelID = channel.id;

  try {
    const botCheck = await checkBotPresenceAndPermissions(interaction, channel);
    if (!botCheck) return ;

    const userPermissionsCheck = await checkUserPermissions(interaction, channel);
    if (!userPermissionsCheck.success) return interaction.reply({ content: userPermissionsCheck.message, flags: 64 });

    const channelInDb = await db.valueExists('channels', 'channelID', channelID)
    if (!channelInDb) return interaction.reply({ content: channelInDb.message, flags: 64 });

    const lastMsgID = db
        .prepare("SELECT msgID FROM channels WHERE channelID = ?")
        .get(channelID);
    if (lastMsgID) {
      const messageDiscord = await channel.messages.fetch(lastMsgID.msgID);
      if (messageDiscord) await messageDiscord.delete();
    }
    db.removeValue('channels', 'channelID', channelID);
    return interaction.reply({ content: `Channel <#${channelID}> deleted to the database.`, flags: 64 });

  }
  catch (error) {
    console.error('Error adding channel:', error);
    return interaction.reply({ content: 'There was an error while executing untrackchannel command.', flags: 64 });
  }
}