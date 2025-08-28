import Database from 'better-sqlite3';

const db = new Database('./db/database.sqlite');
db.pragma('journal_mode = WAL');

// DB channels
db.exec("CREATE TABLE IF NOT EXISTS channels (channelID TEXT NOT NULL UNIQUE, msgID TEXT)");
// TODO : replace with a discord bot command to set the channelID and insert chanID via command
db.exec("INSERT OR IGNORE INTO channels VALUES (1276305483333898291, NULL)"); // TESTING DEV
db.exec("INSERT OR IGNORE INTO channels VALUES (1279476635455848458, NULL)"); // TESTING ANNONCE

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


/**
 * Check if a value exists in a specific table and column.
 * @param {string} table - The name of the table to check.
 * @param {string} column - The name of the column to check.
 * @param {string} value - The value to look for.
 */
db.valueExists = function (table, column, value) {
    const stmt = db.prepare(`SELECT 1 FROM ${table} WHERE ${column} = ? LIMIT 1`);
    return !!stmt.get(value); // returns true if exists, false otherwise
}

/**
 * Add a value to a specific table and column.
 * @param {string} table - The name of the table to add to.
 * @param {string} column - The name of the column to add to.
 * @param {string} value - The value to add.
 */
db.addValue = function (table, column, value) {
    if (this.valueExists(table, column, value)) {
        console.log(`Value already exists in ${table}.${column}: ${value}`);
        return;
    }
    const stmt = this.prepare(`INSERT INTO ${table} (${column}) VALUES (?)`);
    stmt.run(value);
    console.log(`Value added to ${table}.${column}: ${value}`);
}

/**
 * Remove a value from a specific table and column.
 * @param {string} table - The name of the table to remove from.
 * @param {string} column - The name of the column to remove from.
 * @param {string} value - The value to remove.
 */
db.removeValue = function (table, column, value) {
  if (!this.valueExists(table, column, value)) {
    console.log(`Value does not exist in ${table}.${column}: ${value}`);
    return;
  }
  const stmt = this.prepare(`DELETE FROM ${table} WHERE ${column} = ?`);
  stmt.run(value);
  console.log(`Value removed from ${table}.${column}: ${value}`);
};


export default db;