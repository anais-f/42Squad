import Database from 'better-sqlite3';

const db = new Database('./db/database.sqlite');
db.pragma('journal_mode = DELETE');
db.pragma('foreign_keys = ON');

db.exec("CREATE TABLE IF NOT EXISTS channels (channelID TEXT NOT NULL UNIQUE, msgID TEXT)");
db.exec("CREATE TABLE IF NOT EXISTS students (login TEXT NOT NULL UNIQUE, host TEXT)");
db.exec("CREATE TABLE IF NOT EXISTS tracked (channelID TEXT NOT NULL, login TEXT NOT NULL, FOREIGN KEY (channelID) REFERENCES channels(channelID) ON DELETE CASCADE, FOREIGN KEY (login) REFERENCES students(login), UNIQUE(channelID, login))");

/**
 * Check if a value exists in a specific table and column. It returns true if the value exists, false otherwise.
 * @param {string} table - The name of the table to check.
 * @param {string} column - The name of the column to check.
 * @param {string} value - The value to look for.
 */
db.valueExists = function (table, column, value) {
  const stmt = db.prepare(`SELECT 1 FROM ${table} WHERE ${column} = ? LIMIT 1`);
  return !!stmt.get(value);
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
    return { success: false };
  }

  const stmt = this.prepare(`INSERT INTO ${table} (${column}) VALUES (?)`);
  stmt.run(value);
  console.log(`Value added to ${table}.${column}: ${value}`);
  return { success: true };
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
    return { success: false };
  }

  const stmt = this.prepare(`DELETE FROM ${table} WHERE ${column} = ?`);
  stmt.run(value);
  console.log(`Value removed from ${table}.${column}: ${value}`);
  return { success: true };
};

export default db;