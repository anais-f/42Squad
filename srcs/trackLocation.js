const {Api42} = require('../Api42.js/Api42.js');

const api42 = new Api42();

const tracking = [
	{login: "ljurdant", location: null},
	{login: "etessier", location: null},
	{login: "atonkopi", location: null},
	{login: "alsiavos", location: null},
	{login: "pgrellie", location: null},
	{login: "pduhamel", location: null},
	{login: "ede-cola", location: null},
]

async function main() {
const usersLocation = await api42.getCampusLocations(1, true);
usersLocation.forEach((user) => {
	const trackUser = tracking.find(log => log.login === user.user.login);
	if (trackUser) {
		trackUser.location = user.host;
	}
	});
tracking.forEach((trackUser) => {
	if (trackUser.location === null) {
		trackUser.location = "unavailable";
	}
	});
	
console.log(tracking);
}

main();
