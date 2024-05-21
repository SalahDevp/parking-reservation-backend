const express = require("express");
const app = express();
const userRouter = require("./controllers/users");
const parkingRouter = require("./controllers/parkings");
const path = require("path");

app.use(express.json());

//server static files (images...)
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.json("Welcome to parking reservations API");
});

app.use("/users", userRouter);
app.use("/parkings", parkingRouter);

app.listen(8000, "0.0.0.0", () => {
  console.log("Server is running on port 8000");
});
