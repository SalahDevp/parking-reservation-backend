const router = require("express").Router();
const dbFactory = require("../db");
const verifyToken = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt");

// Registration Endpoint
router.post("/register", async (req, res) => {
  const db = await dbFactory();
  const { firstName, lastName, email, password, phone } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `INSERT INTO users (firstName, lastName, email, password, phone) VALUES (?, ?, ?, ?, ?)`;
  try {
    const { lastID } = await db.run(sql, [
      firstName,
      lastName,
      email,
      hashedPassword,
      phone,
    ]);
    const token = jwt.sign({ userId: lastID }, config.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  const db = await dbFactory();
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;
  try {
    const user = await db.get(sql, [email]);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed, user not found." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Authentication failed, incorrect password." });
    }
    const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// User Profile Endpoint
router.get("/profile", verifyToken, async (req, res) => {
  const db = await dbFactory();
  const sql = `SELECT * FROM users WHERE id = ?`;
  try {
    const user = await db.get(sql, [req.userId]);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
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

router.get("/reservations", verifyToken, async (req, res) => {
  const db = await dbFactory();
  const sql = `SELECT * FROM reservations WHERE userId = ?`;
  try {
    const reservations = await db.all(sql, req.userId);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// Specific Reservation Details Endpoint
router.get("/reservations/:reservationId", verifyToken, async (req, res) => {
  const db = await dbFactory();
  const sql = `SELECT * FROM reservations WHERE userId = ? AND id = ?`;
  try {
    const reservation = await db.get(sql, [
      req.userId,
      req.params.reservationId,
    ]);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;
