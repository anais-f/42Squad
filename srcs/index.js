const {Api42} = require('../Api42.js/Api42.js');
const { buildUserEmbed } = require('./buildUserEmbed.js');

const api42 = new Api42();

async function main() {
    // Require the necessary discord.js classes
    const { Client, Events, GatewayIntentBits } = require('discord.js');

    // Create a new client instance
    const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ] });

    // When the client is ready, run this code (only once).
    client.once(Events.ClientReady, async (readyClient) => {
        console.log(`Logged in as ${readyClient.user.tag}`);
        
        // Write a message in a channel
        const channel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
        if (channel) {
            channel.send(`Logged in as ${client.user.tag}`);
        }
    });
    
    client.on("messageCreate", searchLogin);

    // Log in to Discord with your client's token
    await client.login(process.env.DISCORD_TOKEN);

    client.user.setActivity("in development");
}

async function searchLogin(message) {
  if (message.author.bot)
    return ;
  const index_end = message.content.search("@42");
  if (index_end === -1 || index_end === 0)
    return;
  let index = index_end - 1;
  message.content = message.content.toLowerCase();
  while (index > 0 && message.content[index - 1] != " ")
    index--;
  const login = message.content.slice(index, index_end);
  try {
    const user = await api42.getUser(login);
    await message.reply({ embeds: [buildUserEmbed(user)] });
  } catch (err) {
    message.reply(`\`${login}\` : login not found`);
    console.error(err);
  }
}

main();