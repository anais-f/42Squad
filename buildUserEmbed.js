const { EmbedBuilder } = require("discord.js");

const fieldsFunctions = [
	getCursusField,
	getPorfileField,
]

module.exports.buildUserEmbed = function(user) {
	const embed = new EmbedBuilder()
    .setTitle(`${user.login}`)
    .setImage(user.image.versions.small)
    .setColor("#000000")
    .setFooter({
      iconURL: "https://i.imgur.com/5IZAbP0.png",
      text: `${getPrimaryCampus(user)} - ${user.pool_month} ${user.pool_year}`,
    });
	fieldsFunctions.forEach(func => {
		const field = func(user);
		if (field) {
			embed.addFields(field);
		}
	});
	return embed;
}

const trackedCursus = [
  { id: 21, name: "42Cursus" },
  { id: 9, name: "C Piscine" },
  { id: 3, name: "Discovery Piscine - Web" },
];

function getCursusField(user) {
  for (let i = 0; i < trackedCursus.length; i++) {
    const selected = user.cursus_users.find(
      (element) => element.cursus_id === trackedCursus[i].id
    );
    if (selected)
      return {
        name: trackedCursus[i].name,
        value: `lvl ${selected.level}`,
        inline: true,
      };
  }
	return null;
}



function getPiscineField(user) {
	return {
		name: "Piscine",
		value: `$, `,
		inline: false,
	}
}

function getPorfileField(user) {
	return {
		name: "Intra",
		value: `[link](https://profile.intra.42.fr/users/${user.login})`,
		inline: false,
	}
}


function getPrimaryCampus(user) {
  for (let i = 0; i < user.campus_users.length; i++) {
    if (user.campus_users[i].is_primary === true)
    {
			for (let j = 0; j < user.campus.length; j++) {
        if (user.campus[j].id === user.campus_users[i].campus_id) {
          return user.campus[j].name;
        }
      }
    }
  }
	return null;
};

function getCampusField(user) {
  for (let i = 0; i < user.campus_users.length; i++) {
    if (user.campus_users[i].is_primary === true)
    {
			for (let j = 0; j < user.campus.length; j++) {
        if (user.campus[j].id === user.campus_users[i].campus_id) {
          return {
            name: "Campus",
            value: user.campus[j].name,
            inline: true,
          };
        }
      }
    }
  }
	return null;
};