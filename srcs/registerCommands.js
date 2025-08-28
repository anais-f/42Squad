import { REST, Routes } from 'discord.js';
import { data } from './commands/ping.js';

console.log('Registering slash commands...');
console.log("discord token:", process.env.DISCORD_TOKEN);
console.log('client id:', process.env.CLIENT_ID);
console.log("guild id:", process.env.GUILD_ID);


const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: [data.toJSON()] },
    );
    console.log('Commande ping enregistrée');
  } catch (error) {
    console.error(error);
  }
})();