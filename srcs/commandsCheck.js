export async function checkPermissions(interaction) {
  if (!interaction.member.permissions.has('Administrator') &&
      !interaction.member.permissions.has('ManageGuild') &&
      !interaction.member.permissions.has('ManageRoles')) {
    return { success: false, message: 'You do not have the required permissions to use this command.' };
  }
  return { success: true };
}

export async function checkBotPresence(interaction, channelID) {
  const botMember = interaction.guild.members.me;
  const channel = await interaction.client.channels.fetch(channelID);
  if (!channel.members.has(botMember.id)) {
    return { success: false, message: 'The bot is not present in the specified channel.' };
  }
  return { success: true };
}