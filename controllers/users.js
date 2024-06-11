const router = require("express").Router();
const dbFactory = require("../db");
const jwt = require("jsonwebtoken");
const config = require("../config");

router.post("/register", async (req, res) => {
  const db = await dbFactory();
  const { firstName, lastName, email, password, phone } = req.body;
  const sql = `INSERT INTO users (firstName, lastName, email, password, phone) VALUES (?, ?, ?, ?, ?)`;
  try {
    await db.run(sql, [firstName, lastName, email, password, phone]);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const db = await dbFactory();
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
  try {
    const user = await db.get(sql, [email, password]);
    const token = jwt.sign({ userId: user.id }, config.JWT_SECRET);
    res.json({ userId: user.id, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Get user details
router.get("/:id", async (req, res) => {
  const db = await dbFactory();
  const sql = `SELECT * FROM users WHERE id = ?`;
  const user = await db.get(sql, [req.params.id]);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  delete user.password;
  res.json(user);
});

router.post("/:id/firebase-token", async (req, res) => {
  const db = await dbFactory();
  const { token } = req.body;
  const sql = `UPDATE users SET firebaseToken = ? WHERE id = ?`;
  try {
    await db.run(sql, [token, req.params.id]);
    res.json({ message: "Firebase token saved successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Get user reservations
router.get("/:id/reservations", async (req, res) => {
  const db = await dbFactory();
  const sql = `SELECT * FROM reservations WHERE userId = ?`;
  const reservations = await db.all(sql, req.params.id);
  res.json(reservations);
});

//Get user reservation details
router.get("/:id/reservations/:reservationId", async (req, res) => {
  const db = await dbFactory();
  const sql = `SELECT * FROM reservations WHERE userId = ? AND id = ?`;
  const reservation = await db.get(sql, [
    req.params.id,
    req.params.reservationId,
  ]);
  res.json(reservation);
});

module.exports = router;
