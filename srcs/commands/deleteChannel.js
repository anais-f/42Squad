import { SlashCommandBuilder } from 'discord.js';
import db from "../database.js";

export const data = new SlashCommandBuilder()
    .setName('deletechannel')
    .setDescription('Delete a channel to the database.')
    .addStringOption(option =>
        option.setName('channelid')
            .setDescription('The ID of the channel to add (numeric only).')
            .setRequired(true)
    );

export async function execute(interaction) {
  const channelID = interaction.options.getString('channelid');

  try {
    // verifier si le user a les droits d'admin ou de moderator
    if (!interaction.member.permissions.has('Administrator') &&
        !interaction.member.permissions.has('ManageGuild') &&
        !interaction.member.permissions.has('ManageRoles')) {
      return interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
    }

    //verifier si le bot existe dans le channel -> sinon message d'erreur
    const botMember = interaction.guild.members.me;
    const channel = await interaction.client.channels.fetch(channelID);
    if (!channel.members.has(botMember.id)) {
      return interaction.reply({ content: 'The bot is not present in the specified channel.', ephemeral: true });
    }

    // check si le channel existe
    const channelExists = await interaction.client.channels.fetch(channelID);
    // si non -> message d'erreur
    if (!channelExists) {
      return interaction.reply({ content: 'Channel not found.', ephemeral: true });
    }

    // si oui -> check si le channel est déjà dans la db -> oui -> message d'erreur
    if (await db.valueExists('channels', 'channelID', channelID)) {
      return interaction.reply({ content: 'Channel is already in the database.', ephemeral: true });
    }
    // si oui et non dans la DB -> l'ajouter
    await db.addValue('channels', 'channelID', channelID);
    return interaction.reply({ content: `Channel <#${channelID}> added to the database.`, ephemeral: true });

  }
  catch (error) {
    console.error('Error adding channel:', error);
    return interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
  }
}