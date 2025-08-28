import Database from 'better-sqlite3';

const db = new Database('./db/database.sqlite');
db.pragma('journal_mode = WAL');

// DB channels
db.exec("CREATE TABLE IF NOT EXISTS channels (channelID TEXT NOT NULL UNIQUE, msgID TEXT)");
// TODO : replace with a discord bot command to set the channelID and insert chanID via command
db.exec("INSERT OR IGNORE INTO channels VALUES (1276305483333898291, NULL)");

// DB students tracking
db.exec("CREATE TABLE IF NOT EXISTS students (login TEXT NOT NULL UNIQUE, host TEXT)");
// TODO : replace discord command to add and delete students from tracking
db.exec("INSERT OR IGNORE INTO students VALUES ('acancel', NULL)");
db.exec("INSERT OR IGNORE INTO students VALUES ('anfichet', NULL)");
db.exec("INSERT OR IGNORE INTO students VALUES ('bwisniew', NULL)");
db.exec("INSERT OR IGNORE INTO students VALUES ('cdomet-d', NULL)");
db.exec("INSERT OR IGNORE INTO students VALUES ('csweetin', NULL)");
db.exec("INSERT OR IGNORE INTO students VALUES ('ibertran', NULL)");
db.exec("INSERT OR IGNORE INTO students VALUES ('kchillon', NULL)");
db.exec("INSERT OR IGNORE INTO students VALUES ('lcottet', NULL)");
db.exec("INSERT OR IGNORE INTO students VALUES ('lrio', NULL)");
db.exec("INSERT OR IGNORE INTO students VALUES ('mjuffard', NULL)");
db.exec("INSERT OR IGNORE INTO students VALUES ('scros', NULL)");

//DB chan/users
// db.exec("CREATE TABLE IF NOT EXISTS chan_students (channelID TEXT NOT NULL, login TEXT NOT NULL)");

export default db;