# ft_affreuses_fouines

Discord bot for the awful weasels.

## Features
- Track login activity of 42 school students
- Display tracking information in a Discord embed
- Add or remove channels for tracking
- Add or remove login IDs to track
- Edit and update tracking messages
- Provide simple slash commands for server management
- Search and display an embed about a specific user

## How to Use
Invite the bot to your server using the following link:

[Invite Link](https://discord.com/oauth2/authorize?client_id=1276127823433826417)

Once added, use the available commands in the channels where the bot has permissions and where you would like to track login activity:
- `/trackchannel`: Add the channel to the database.
- `/untrackchannel`: Remove the channel from the database.
- `/tracklogin <login>`: Add a login ID to track.
- `/untracklogin <login>`: Remove a login ID from tracking.
- `/listlogins`: List all tracked logins in the current channel.
These commands will only be available for the administrator of the server.

Another command is available for all users to search for a specific user and display their information in an embed:
- `/search <login>`: Search for a user and display their information.

## Bot permissions
The bot requires the following permissions to function correctly:
- Send messages in channels
- Edit messages in tracking channels
- Read message history 

## Support
For help or questions, contact the bot administrator.

## License
This project is licensed under the MIT License.

