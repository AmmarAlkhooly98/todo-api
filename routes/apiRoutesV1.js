const express = require("express");
const router = express.Router();

router.use("/users", require("../lib/users/routes"));

router.use("/todos", require("../lib/todos/routes"));

module.exports = router;
