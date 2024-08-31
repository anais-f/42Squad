const { EmbedBuilder } = require("discord.js");

const embed = new EmbedBuilder()
  .setTitle("Localisation")
  .setDescription("**Name** logged in : ``location``\ngfd")
  .setColor("#000000")
  .setFooter({
    text: "Edited",
  })
  .setTimestamp();

await message.reply({ embeds: [embed] });