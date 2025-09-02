import { EmbedBuilder } from "discord.js";
import { api42 } from "./apiInterface.js";
import db from "./database.js";

/**
 * Fetches the current campus locations of users and updates the database with their host information.
 * If a user is not found in the fetched data, their host information is set to NULL in the database.
 * @returns {Promise<void>}
 */
async function trackLocation() {
  const usersLocation = await api42.getCampusLocations(9, true);
  const usersMap = new Map(usersLocation.map((user) => [user.user.login, user.host]));

  const updateHost = db.prepare("UPDATE students SET host = ? WHERE login = ?");
  const resetHost = db.prepare("UPDATE students SET host = NULL WHERE login = ?");

  const loginsTracked = db.prepare("SELECT login FROM students").all().map(row => row.login);

  loginsTracked.forEach(login => {
    const host = usersMap.get(login);
    if (host) updateHost.run(host, login);
    else  resetHost.run(login);
  });
}

/**
 * Creates a Discord embed message displaying the locations of users.
 * @param locations
 * @returns {EmbedBuilder}
 */
function createLocationEmbed(locations) {
 const embed = new EmbedBuilder()
      .setColor("#00ecef")
      .setDescription("## 🪿 Currently logged in")
      .setTimestamp();
    locations.forEach((element) => {
      embed.addFields({
        name: `\`${element.login.padEnd(8, " ")}\` 📍`,
        value: "⤷" + "`" + element.host + "`",
        inline: true,
      });
    });
    return embed;
}

/**
 * Sends a new message to the specified Discord channel and updates the database with the message ID.
 * @param chanDiscord
 * @param chanID
 * @param embed
 * @returns {Promise<void>}
 */
async function sendNewMessage(chanDiscord, chanID, embed) {
  if (!chanDiscord) {
    console.error(`Channel with ID ${chanID} not found in cache.`);
    return;
  }
    const messageDiscord = await chanDiscord
        .send({ embeds: [embed] })
        .catch((error) => {
            console.error(`Error sending message: ${error.rawError.message}`);
        });
    db.prepare("UPDATE channels SET msgID = ? WHERE channelID = ?").run(
        messageDiscord.id,
        chanID
    );
}

/**
 * Main function to display locations of tracked users in their respective channels.
 * @param client
 * @returns {Promise<void>}
 */
async function displayLocations(client) {
  try {
    await trackLocation();
    const chanArrayID = db.prepare("SELECT channelID FROM channels").all().map(row => row.channelID);
    const locations = db.prepare("SELECT * FROM students WHERE host IS NOT NULL").all();

    for (const chanID of chanArrayID) {
      const trackedLogins = db.prepare("SELECT login FROM tracked WHERE channelID = ?").all(chanID).map(row => row.login);
      const filteredLocations = locations.filter(location => trackedLogins.includes(location.login));
      filteredLocations.sort((a, b) => a.host.localeCompare(b.host));

      const embed = createLocationEmbed(filteredLocations);

      const chanDiscord = client.channels.cache.get(chanID);
      if (chanDiscord) {
        const lastMsgID = db
            .prepare("SELECT msgID FROM channels WHERE channelID = ?")
            .get(chanID);

        if (!lastMsgID || !lastMsgID.msgID) await sendNewMessage(chanDiscord, chanID, embed);
        else {
          try {
            const messageDiscord = await chanDiscord.messages.fetch(lastMsgID.msgID);
            await messageDiscord.edit({ embeds: [embed] });
          }
          catch (error) {
            console.error(`Error sending message: ${error.rawError.message}`);
            await sendNewMessage(chanDiscord, chanID, embed);
          }
        }
      }
    }
  } catch (error) {
    console.log("Error in displayLocations:");
    console.error(error);
  }
}

export default displayLocations;
