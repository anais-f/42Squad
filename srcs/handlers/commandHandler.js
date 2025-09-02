import fs from 'fs';
import path from 'path';

export async function loadCommands(client, commandsPath) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      const command = await import(filePath);
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    } catch (error) {
      console.error(`Error loading command at ${filePath}:`, error);
    }
  }
}