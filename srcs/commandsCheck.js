export async function checkUserPermissions(interaction, channel) {
  const member = await interaction.guild.members.fetch(interaction.user.id);
  const permissions = channel.permissionsFor(member);

  if (!permissions.has('Administrator') &&
      !permissions.has('ManageGuild') &&
      !permissions.has('ManageRoles') &&
      !permissions.has('UseApplicationCommands')) {
    return { success: false, message: 'You do not have the required permissions in this channel.' };
  }
  return { success: true };
}

export async function checkBotPresenceAndPermissions(interaction, channel) {
  const botMember = await interaction.guild.members.fetch(interaction.client.user.id);

  if (!channel.members.has(botMember.id)) {
    console.error('Bot is not present in the specified channel.');
    return false;
  }

  const botPermissions = channel.permissionsFor(botMember);
  if (!botPermissions.has('SendMessages', false)) {
    console.error('Bot does not have the required permissions in the specified channel.');
    return false;
  }
  return true;
}