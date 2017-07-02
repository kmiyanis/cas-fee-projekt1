const express = require('express');
const router = express.Router();
const todos = require('../controller/todoController.js');

router.get("/:filter/", todos.getAll);
router.post("/", todos.createTodo);
router.get("/todo/:id/", todos.getOne);
router.put("/edit/:id/", todos.editTodo);
router.put("/done/:id/", todos.updateStatus);

module.exports = router;