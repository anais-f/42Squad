const {Api42} = require('../Api42.js/Api42.js');

const api42 = new Api42();

const tracking = [
	{login: "acancel", location: null},
	{login: "anfichet", location: null},
	{login: "bwisniew", location: null},
	{login: "cdomet-d", location: null},
	{login: "csweetin", location: null},
	{login: "ibertran", location: null},
	{login: "kchillon", location: null},
	{login: "lcottet", location: null},
	{login: "lrio", location: null},
	{login: "mjuffard", location: null},
]

async function trackLocation() {
	const usersLocation = await api42.getCampusLocations(9, true);

	tracking.forEach((user) => {
		const trackUser = usersLocation.find(loginUser => loginUser.user.login === user.login);
		if (trackUser) {
			user.location = trackUser.host;
		}
	});
	tracking.forEach((user) => {
		if (user.location === null) {
			user.location = "unavailable";
		}
	});
	//console.log(tracking);
	return (tracking);
}

//main();
