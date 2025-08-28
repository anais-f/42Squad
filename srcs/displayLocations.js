import { EmbedBuilder } from "discord.js";
import { api42 } from "./apiInterface.js";
import db from "./database.js";

async function trackLocation() {
  const usersLocation = await api42.getCampusLocations(9, true);

  const updateHost = db.prepare("UPDATE students SET host = ? WHERE login = ?");
  usersLocation.forEach((user) => {
    updateHost.run(user.host, user.user.login);
  })
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
    const locations = db.prepare("SELECT * FROM students WHERE host IS NOT NULL").all();
    locations.sort((a, b) => a.host.localeCompare(b.host));

    const embed = createLocationEmbed(locations);

    // todo : call a la DB pour le channel avec une boucle si plusieurs channels
    const chanID = process.env.TRACK_CHANNEL; // recuperer l'ID du channel depuis les variables d'environnement
    const chanDiscord = client.channels.cache.get(chanID); // recupere le channel via son ID

    if (chanDiscord) {
      const lastMsgID = db
        .prepare("SELECT msgID FROM channels WHERE channelID = ?")
        .get(chanID);

      if (!lastMsgID.msgID) await sendNewMessage(chanDiscord, chanID, embed);
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
  } catch (error) {
    console.error(error);
  }
}

export default displayLocations;

// if (channel) {
//     const lastMsgID = db
//         .prepare("SELECT msgID FROM channels WHERE channelID = ?")
//         .get(chanID);
//     if (!lastMsgID.msgID) {
//         const message = await channel
//             .send({ embeds: [embed] })
//             .catch((error) => {
//                 console.error(`Error senting message: ${error.rawError.message}`);
//             });
//         db.prepare("UPDATE channels SET msgID = ? WHERE channelID = ?").run(
//             message.id,
//             chanID
//         );
//     } else {
//         const message = await channel.messages
//             .fetch(lastMsgID.msgID)
//             .catch(async (error) => {
//                 const message = await channel
//                     .send({ embeds: [embed] })
//                     .catch((error) => {
//                         console.error(
//                             `Error senting message: ${error.rawError.message}`
//                         );
//                     });
//                 db.prepare("UPDATE channels SET msgID = ? WHERE channelID = ?").run(
//                     message.id,
//                     chanID
//                 );
//             });
//         if (!message) return;
//         message.edit({ embeds: [embed] }).catch(async (error) => {
//             const message = await channel
//                 .send({ embeds: [embed] })
//                 .catch((error) => {
//                     console.error(`Error senting message: ${error.rawError.message}`);
//                 });
//             db.prepare("UPDATE channels SET msgID = ? WHERE channelID = ?").run(
//                 message.id,
//                 chanID
//             );
//         });
//     }
// }
// } catch (error) {
//     console.error(error);
// }