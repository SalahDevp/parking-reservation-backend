const express = require("express");
const app = express();
const db = require("./db");

app.use(express.json());
app.post("/users/register", (req, res) => {
  const { firstname, lastname, email, password, phoneNumber } = req.body;
  const sql = `INSERT INTO users (firstname, lastname, email, password, phoneNumber) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [firstname, lastname, email, password, phoneNumber], (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "User registered successfully" });
  });
});

app.get("/parkings", (req, res) => {
  const sql = `SELECT * FROM parkings`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/", (req, res) => {
  res.json("home page");
});
app.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});
