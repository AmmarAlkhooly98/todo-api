const express = require("express");
const router = express.Router();
const controller = require("../controller");
const auth = require("../../auth-services");

router.post("/", auth.verifyUser, controller.createTodo);

router.get("/", auth.verifyUser, controller.getUserTodos);

router.get("/:id", auth.verifyUser, controller.getTodo);

router.patch("/:id", auth.verifyUser, controller.updateTodoCompleted);

router.put("/:id", auth.verifyUser, controller.updateTodo);

router.delete("/:id", auth.verifyUser, controller.deleteTodo);

module.exports = router;
