const store = require("../services/todoStore.js");


module.exports.getAll = function (req, res) {
    store.all(req.params.filter, function (err, todos) {
        res.json(todos || {});
    })
};

module.exports.createTodo = function (req, res) {
    store.add(req.body, function (err, todo) {
        res.json(todo);
    });
};

module.exports.getOne = function (req, res) {
    store.get(req.params.id, function (err, todo) {
        res.json(todo);
    });
};

module.exports.editTodo = function (req, res) {
    store.edit(req.params.id, req.body, function (err, todo) {
        res.json(todo);
    });
};


module.exports.updateStatus = function (req, res) {
    store.updateStatus(req.params.id, req.body, function (err, todo) {
        res.json(todo);
    });
};
