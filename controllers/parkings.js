const router = require("express").Router();
const dbFactory = require("../db");

// Get parkings list
router.get("/", async (req, res) => {
  const sql = `SELECT * FROM parkings`;
  const db = await dbFactory();

  const parkings = await db.all(sql);

  res.json(parkings);
});

// Get parking details
router.get("/:id", async (req, res) => {
  const sql = `SELECT * FROM parkings WHERE id = ?`;
  const db = await dbFactory();

  const parking = await db.get(sql, req.params.id);

  res.json(parking);
});

// Reserve a parking slot
router.post("/:id/reservations", async (req, res) => {
  const db = await dbFactory();
  const { userId, date, entryTime, exitTime } = req.body;
  //check if there is available slot

  let sql = `SELECT count(id) count FROM reservations WHERE parkingId = ? AND date = ? AND entryTime < ? AND exitTime > ?`;
  reservedSlots = await db.get(sql, [req.params.id, date, exitTime, entryTime]);
  sql = `SELECT numSlots FROM parkings WHERE id = ?`;
  const { numSlots } = await db.get(sql, req.params.id);

  if (reservedSlots.count === numSlots) {
    return res.status(400).json({ message: "No available slots" });
  }

  sql = `INSERT INTO reservations (userId, parkingId, date, entryTime, exitTime) VALUES (?, ?, ?, ?, ?)`;
  const { lastID } = await db.run(sql, [
    userId,
    req.params.id,
    date,
    entryTime,
    exitTime,
  ]);
  res.json({ reservationId: lastID });
});

module.exports = router;
