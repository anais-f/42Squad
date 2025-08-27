const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/database.sqlite');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS channel (channelID TEXT NOT NULL UNIQUE, msgID TEXT)");
    db.run("INSERT OR IGNORE INTO channel VALUES (1276305483333898291, NULL)");

});

module.exports = db;