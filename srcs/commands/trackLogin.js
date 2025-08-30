import { SlashCommandBuilder } from 'discord.js';
import { MessageFlags } from 'discord.js';
import db from '../database.js';
import { checkBotPresenceAndPermissions} from "../commandsCheck.js";
import { api42 } from "../apiInterface.js";

export const data = new SlashCommandBuilder()
    .setName('tracklogin')
    .setDescription('Add a login to the database to track it in this channel.')
    .addStringOption(option =>
        option.setName('tracklogin')
          .setDescription('Add the login to the DB to track it in this channel.')
          .setRequired(true)
          .setMaxLength(8)
    );

export async function execute(interaction) {
  const channel = interaction.channel;
  console.log("channel: ", channel);
  const channelID = channel.id;
  const login = interaction.options.getString('tracklogin').toLowerCase();

  try {
    const botCheck = await checkBotPresenceAndPermissions(interaction, channel);
    if (!botCheck.success) return interaction.reply({ content: botCheck.message, flags: MessageFlags.Ephemeral });

    // const userPermissionsCheck = await checkUserPermissions(interaction, channel);
    // if (!userPermissionsCheck.success) return interaction.reply({ content: userPermissionsCheck.message, flags: MessageFlags.Ephemeral });

    const channelExisted = await db.valueExists('channels', 'channelID', channelID)
    if (!channelExisted) return interaction.reply({ content: `Channel <#${channelID}> does not exist in the database. Track channel before track login.`, flags: MessageFlags.Ephemeral });

    const trackedCount = db.prepare("SELECT COUNT(*) as count FROM tracked WHERE channelID = ?").get(channelID);
    console.log("tracked count: ", trackedCount);
    if (trackedCount.count >= 24) return interaction.reply({ content: `You have reached the maximum number of tracked logins (24) for this channel <#${channelID}>.`, flags: MessageFlags.Ephemeral });

    const loginExisted = await db.valueExists('students', 'login', login)
    if (loginExisted) {
      const loginTrackedInChannel = db.prepare("SELECT 1 FROM tracked WHERE channelID = ? AND login = ?").get(channelID, login);
      if (loginTrackedInChannel) return interaction.reply({ content: `Login \`${login}\` is already tracked in this channel <#${channelID}>.`, flags: MessageFlags.Ephemeral });
      const stmt = db.prepare("INSERT INTO tracked (channelID, login) VALUES (?, ?)");
      stmt.run(channelID, login);

      return interaction.reply({ content: `Login \`${login}\` is now tracked in this channel <#${channelID}>.`, flags: MessageFlags.Ephemeral });
    }
    else {
      try {
        await api42.getUser(login);
        const studentStmt = db.prepare("INSERT INTO students (login) VALUES (?)");
        studentStmt.run(login);
        const stmt = db.prepare("INSERT INTO tracked (channelID, login) VALUES (?, ?)");
        stmt.run(channelID, login);

        return interaction.reply({ content: `Login \`${login}\` added in the tracked channel.`, flags: MessageFlags.Ephemeral });
      }
      catch (error) {
        if (!error.rawError) {
          return interaction.reply({content: `Login \`${login}\` not found on 42 API.`, flags: MessageFlags.Ephemeral});
        }
      }
    }
  }
  catch (error) {
    console.error('Error adding channel:', error);
    return interaction.reply({ content: 'There was an error while executing tracklogin command.', flags: MessageFlags.Ephemeral });
  }
}