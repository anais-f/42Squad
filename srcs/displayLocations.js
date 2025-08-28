import { EmbedBuilder } from "discord.js";
import { api42 } from "./apiInterface.js";
import db from "./database.js";

// const tracking = [
//   { login: "acancel", host: null },
//   { login: "anfichet", host: null },
//   { login: "bwisniew", host: null },
//   { login: "cdomet-d", host: null },
//   { login: "csweetin", host: null },
//   { login: "ibertran", host: null },
//   { login: "kchillon", host: null },
//   { login: "lcottet", host: null },
//   { login: "lrio", host: null },
//   { login: "mjuffard", host: null },
//   { login: "scros", host: null },
// ];
//
// async function trackLocation() {
//   const usersLocation = await api42.getCampusLocations(9, true);
//   tracking.forEach((user) => {
//     const trackUser = usersLocation.find(
//         (loginUser) => loginUser.user.login === user.login
//     );
//     if (trackUser) {
//       user.host = trackUser.host;
//     } else {
//       user.host = null;
//     }
//   });
//   return tracking;
// }

// on MAJ le host de la table tracking
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

async function displayLocations(client) {
  try {
    // let locations = await trackLocation();
    // locations = locations.filter((element) => element.host);

    await trackLocation();
    const locations = db.prepare("SELECT * FROM students WHERE host IS NOT NULL").all();
    locations.sort((a, b) => a.host.localeCompare(b.host));

    const embed = createLocationEmbed(locations);
   
    const channelID = process.env.TRACK_CHANNEL;
    const channel = client.channels.cache.get(channelID);

    if (channel) {
      const lastMessage = db
        .prepare("SELECT msgID FROM channels WHERE channelID = ?")
        .get(channelID);
      if (!lastMessage.msgID) {
        const message = await channel
          .send({ embeds: [embed] })
          .catch((error) => {
            console.error(`Error senting message: ${error.rawError.message}`);
          });
        db.prepare("UPDATE channels SET msgID = ? WHERE channelID = ?").run(
          message.id,
          channelID
        );
      } else {
        const message = await channel.messages
          .fetch(lastMessage.msgID)
          .catch(async (error) => {
            const message = await channel
              .send({ embeds: [embed] })
              .catch((error) => {
                console.error(
                  `Error senting message: ${error.rawError.message}`
                );
              });
            db.prepare("UPDATE channels SET msgID = ? WHERE channelID = ?").run(
              message.id,
              channelID
            );
          });
        if (!message) return;
        message.edit({ embeds: [embed] }).catch(async (error) => {
          const message = await channel
            .send({ embeds: [embed] })
            .catch((error) => {
              console.error(`Error senting message: ${error.rawError.message}`);
            });
          db.prepare("UPDATE channels SET msgID = ? WHERE channelID = ?").run(
            message.id,
            channelID
          );
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// async function createAndSendMessage()

export default displayLocations;
