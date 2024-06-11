const router = require("express").Router();
const dbFactory = require("../db");
const verifyToken = require("../middleware/authMiddleware");
const schedule = require("node-schedule");
const { sendPushNotification } = require("../libs/firebase");

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
router.post("/:id/reservations", verifyToken, async (req, res) => {
  const db = await dbFactory();
  const { date, entryTime, exitTime } = req.body;
  const reservationDateTime = new Date(`${date}T${entryTime}`);
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
    req.userId,
    req.params.id,
    date,
    entryTime,
    exitTime,
  ]);

  //get user
  sql = `SELECT * FROM users WHERE id=?`;
  const user = await db.get(sql, [req.userId]);
  // Send notification 10 minutes before reservation start
  const jobDate = new Date(
    Math.max(reservationDateTime.getTime() - 10 * 60 * 1000, Date.now() + 2000)
  );
  schedule.scheduleJob(jobDate, () => {
    sendPushNotification(
      user.firebaseToken,
      "Reservation",
      "only 10 minutes remains for your reservation"
    );
  });
  res.json({ reservationId: lastID });
});

module.exports = router;
