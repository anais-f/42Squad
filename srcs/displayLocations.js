import { EmbedBuilder } from "discord.js";
import { api42 } from "./apiInterface.js";
import db from "./database.js";

async function trackLocation() {
  const usersLocation = await api42.getCampusLocations(9, true);

  const updateHost = db.prepare("UPDATE students SET host = ? WHERE login = ?");
  const resetHost = db.prepare("UPDATE students SET host = NULL WHERE login = ?");

  const presentLogins = usersLocation.map(user => user.user.login);
  const loginsTracked = db.prepare("SELECT login FROM students").all().map(row => row.login);

  loginsTracked.forEach(login => {
    const user = usersLocation.find(user => user.user.login === login);
    if (user) updateHost.run(user.host, user.user.login);
    else  resetHost.run(login);
  });
}

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

async function sendNewMessage(chanDiscord, chanID, embed) {
  if (!chanDiscord) {
    console.error(`Channel with ID ${chanID} not found in cache.`);
    return;
  }
    const messageDiscord = await chanDiscord
        .send({ embeds: [embed] })
        .catch((error) => {
            console.error(`Error senting message: ${error.rawError.message}`);
        });
    db.prepare("UPDATE channels SET msgID = ? WHERE channelID = ?").run(
        messageDiscord.id,
        chanID
    );
}

async function displayLocations(client) {
  try {
    await trackLocation();
    const chanArrayID = db.prepare("SELECT channelID FROM channels").all().map(row => row.channelID);

    for (const chanID of chanArrayID) {
      const trackedLogins = db.prepare("SELECT login FROM tracked WHERE channelID = ?").all(chanID).map(row => row.login);
      const locations = db.prepare("SELECT * FROM students WHERE host IS NOT NULL").all();
      const filteredLocations = locations.filter(location => trackedLogins.includes(location.login));
      filteredLocations.sort((a, b) => a.host.localeCompare(b.host));

      const embed = createLocationEmbed(filteredLocations);

      const chanDiscord = client.channels.cache.get(chanID); // recupere le channel via son ID
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
            console.error(`Error senting message: ${error.rawError.message}`);
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
