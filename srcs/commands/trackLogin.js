import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';
import db from '../database.js';
import { checkBotPresenceAndPermissions, MESSAGES } from "../commandsUtils.js";
import { api42 } from "../apiInterface.js";

export const data = new SlashCommandBuilder()
    .setName('tracklogin')
    .setDescription('Add a login to the database to track it in this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('tracklogin')
          .setDescription('Add the login to the database to track it in this channel.')
          .setRequired(true)
          .setMaxLength(8)
    );

export async function execute(interaction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const channel = interaction.channel;
  const channelID = channel.id;
  const login = interaction.options.getString('tracklogin').toLowerCase();

  if (!/^[a-z0-9-]+$/.test(login))
    return interaction.editReply({ content: MESSAGES.ERRORS.INVALID_LOGIN_FORMAT });

  try {
    const botCheck = await checkBotPresenceAndPermissions(interaction, channel);
    if (!botCheck.success)
      return interaction.editReply({ content: botCheck.message });

    const channelExisted = await db.valueExists('channels', 'channelID', channelID)
    if (!channelExisted)
      return interaction.editReply({ content: MESSAGES.ERRORS.CHANNEL_TRACK_FIRST(channelID) });

    const trackedCount = db.prepare("SELECT COUNT(*) as count FROM tracked WHERE channelID = ?").get(channelID);
    if (trackedCount.count >= 24)
      return interaction.editReply({ content: MESSAGES.ERRORS.MAX_TRACKED(channelID) });

    const loginExisted = await db.valueExists('students', 'login', login)
    if (loginExisted) {
      const loginTrackedInChannel = db.prepare("SELECT 1 FROM tracked WHERE channelID = ? AND login = ?").get(channelID, login);
      if (loginTrackedInChannel)
        return interaction.editReply({ content: MESSAGES.ERRORS.LOGIN_ALREADY_TRACKED(login, channelID) });
      db.prepare("INSERT INTO tracked (channelID, login) VALUES (?, ?)").run(channelID, login);

      return interaction.editReply({ content: MESSAGES.SUCCESS.LOGIN_TRACKED(login, channelID) });
    }
    else {
      try {
        await api42.getUser(login);
        const transaction = db.transaction(() => {
          db.prepare("INSERT INTO students (login) VALUES (?)").run(login);
          db.prepare("INSERT INTO tracked (channelID, login) VALUES (?, ?)").run(channelID, login);
        });
        transaction();

        return interaction.editReply({ content: MESSAGES.SUCCESS.LOGIN_TRACKED(login, channelID) });
      }
      catch (errorApi) {
        console.error('API Error: ', errorApi);
        if (errorApi.message && errorApi.message.includes('404'))
          return interaction.editReply({ content: MESSAGES.ERRORS.LOGIN_NOT_FOUND_API(login) });
        return interaction.editReply({ content: MESSAGES.ERRORS.API_ERROR });
      }
    }
  }
  catch (error) {
    console.error('Generic Command Error: ', error);
    return interaction.editReply({ content: MESSAGES.ERRORS.GENERIC('tracklogin') });
  }
}