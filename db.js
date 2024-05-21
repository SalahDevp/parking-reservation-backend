const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

let dbPromise = null;

function initDataBase() {
  return sqlite.open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
}

/**
 *
 * @returns {Promise<sqlite.Database>}
 */
function dbFactory() {
  if (!dbPromise) {
    dbPromise = initDataBase();
  }
  return dbPromise;
}

module.exports = dbFactory;
