const { Router } = require("express");
const RoomsController = require("../modules/rooms/roomsController");

const router = Router();

router.get("/", RoomsController.findAll);
router.get("/:id", RoomsController.findOne);
router.post("/", RoomsController.create);
router.put("/:id", RoomsController.update);
router.delete("/:id", RoomsController.delete);

router.get("/:id/messages", RoomsController.findMessages);

module.exports = router;