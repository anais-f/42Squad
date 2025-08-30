import { SlashCommandBuilder } from 'discord.js';
import { MessageFlags } from 'discord.js';
import db from "../database.js";
import { checkBotPresenceAndPermissions, MESSAGES} from "../commandsUtils.js";

export const data = new SlashCommandBuilder()
    .setName('untrackchannel')
    .setDescription('Delete the channel to the database to track login.');

export async function execute(interaction) {
  const channel = interaction.channel;
  const channelID = channel.id;

  try {
    const botCheck = await checkBotPresenceAndPermissions(interaction, channel);
    if (!botCheck.success) return interaction.reply({ content: botCheck.message, flags: MessageFlags.Ephemeral });

    const lastMsgID = db
        .prepare("SELECT msgID FROM channels WHERE channelID = ?")
        .get(channelID);
    if (lastMsgID) {
      const messageDiscord = await channel.messages.fetch(lastMsgID.msgID);
      if (messageDiscord) await messageDiscord.delete();
    }

    const result = db.removeValue('channels', 'channelID', channelID);
    if (!result.success) return interaction.reply({ content: MESSAGES.ERRORS.CHANNEL_NOT_FOUND(channelID), flags: MessageFlags.Ephemeral });

    return interaction.reply({ content: MESSAGES.SUCCESS.CHANNEL_UNTRACK(channelID), flags: MessageFlags.Ephemeral });
  }
  catch (error) {
    return interaction.reply({ content: MESSAGES.ERRORS.GENERIC('untrackchannel'), flags: MessageFlags.Ephemeral });
  }
}