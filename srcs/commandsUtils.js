export async function checkBotPresenceAndPermissions(interaction, channel) {
  const botMember = await interaction.guild.members.fetch(interaction.client.user.id);

  if (!channel.members.has(botMember.id)) {
    console.error('Bot is not present in the specified channel.');
    return { success: false, message: 'Bot isn\'t present in the specified channel.' };
  }

  const botPermissions = channel.permissionsFor(botMember);
  if (!botPermissions.has('SendMessages', false)) {
    console.error('Bot does not have the required permissions in the specified channel.');
    return { success: false, message: 'Bot doesn\'t have the required permissions in the specified channel.' };
  }
  return { success: true };
}

export const MESSAGES = {
  ERRORS: {
    GENERIC: (command) => `There was an error while executing /${command} command.`,
    CHANNEL_NOT_FOUND: (channelID) => `Channel <#${channelID}> does not exist to track.`,
    CHANNEL_TRACK_FIRST: (channelID) => `Channel <#${channelID}> does not exist, track channel before track login.`,
    CHANNEL_ALREADY_TRACKED: (channelID) => `Channel <#${channelID}> is already tracked.`,
    MAX_TRACKED: (channelID) => `You have reached the maximum number of tracked logins (24) for this channel <#${channelID}>.`,
    LOGIN_ALREADY_TRACKED: (login, channelID) => `Login \`${login}\` is already tracked in this channel <#${channelID}>.`,
    LOGIN_NOT_TRACKED: (login) => `Login \`${login}\` does not exist in tracking base.`,
    LOGIN_NOT_FOUND_API: (login) => `Login \`${login}\` not found on 42 API.`
  },
  SUCCESS: {
    LOGIN_TRACKED: (login, channelID) => `Login \`${login}\` is now tracked in this channel <#${channelID}>.`,
    LOGIN_UNTRACKED: (login) => `Login \`${login}\` untracked from this channel.`,
    CHANNEL_TRACK: (channelID) => `Channel <#${channelID}> is now tracked.`,
    CHANNEL_UNTRACK: (channelID) => `Channel <#${channelID}> deleted.`,
  }
};