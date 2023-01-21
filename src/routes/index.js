const { Router } = require("express");
const messagesRouter = require("./messages");
const usersRouter = require("./users");
const roomsRouter = require("./rooms");

const router = Router();

router.use("/messages", messagesRouter);
router.use("/users", usersRouter);
router.use("/rooms", roomsRouter);

router.get("/", async (req, res) =>
  res.json({ message: "Welcome to chat server!" })
);

module.exports = router;