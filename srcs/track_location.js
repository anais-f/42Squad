const {Api42} = require('../Api42.js/Api42.js');

const api42 = new Api42();

const tracking = [
	{login: "anfichet", host: null},
	{login: "cdomet-d", host: null},
	{login: "bwisniew", host: null},
	{login: "ibertran", host: null},
	{login: "lrio", host: null}
]

async function main() {
const users_location = await api42.getCampusLocations(9, true);
//console.log(users_location);

}

main();