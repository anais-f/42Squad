import Database from 'better-sqlite3';

const db = new Database('./db/database.sqlite');
db.pragma('journal_mode = WAL');


db.exec("CREATE TABLE IF NOT EXISTS channels (channelID TEXT NOT NULL UNIQUE, msgID TEXT)");
db.exec("INSERT OR IGNORE INTO channels VALUES (1276305483333898291, NULL)");
// TODO : make a discord bot command to set the channelID

export default db;