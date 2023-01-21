const { Router } = require("express");
const MessagesController = require("../modules/messages/messagesContoller");

const router = Router();

router.get("/", MessagesController.findAll);
router.get("/:id", MessagesController.findOne);
router.post("/", MessagesController.create);
router.put("/:id", MessagesController.update);
router.delete("/:id", MessagesController.delete);

module.exports = router;