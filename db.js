const sqlite3 = require("sqlite3").verbose();

// Open the database
let db = new sqlite3.Database("./data.db", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Database connected.");
    db.run(
      `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname VARCHAR, lastname VARCHAR, email VARCHAR, password VARCHAR, phoneNumber VARCHAR);
      CREATE TABLE IF NOT EXISTS parkings (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, location VARCHAR, photoUrl INTEGER);`,
      (err) => {
        if (err) {
          console.error("Error creating table " + err.message);
        } else {
          console.log("Table created.");
        }
      }
    );
  }
});

module.exports = db;
