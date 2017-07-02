const Datastore = require('nedb');
const db = new Datastore({ filename: './data/todo.db', autoload: true });

class Todo {
    constructor(todo) {
        this.isDone = false;
        this.doneDate = false;
        this.title = todo.title;
        this.description = todo.description;
        this.created = new Date();
        this.importance = todo.importance;
        this.deadline = todo.deadline;
    }
}


function publicAll(filter, callback)
{
    db.find({}).sort({[filter] : -1}).exec(function (err, todos) {
        callback(err, todos);
    });
}


function publicAdd(todo, callback)
{
    let _todo = new Todo(todo);

    db.insert(_todo, function(err, newDoc){
        if(callback){
            callback(err, newDoc);
        }
    });
}

function publicGet(id, callback)
{
    db.findOne({ _id: id }, function (err, doc) {
        callback( err, doc);
    });
}

function publicEdit(id, todo, callback) {
    db.update({_id: id }, {$set: {title: todo.title, description: todo.description, importance: todo.importance, "deadline": todo.deadline}}, {}, function (err, count) {
        if(callback) {
            callback(err, todo);
        }
    });
}

function publicUpdateStatus(id, todo,  callback) {
    db.update({_id: id}, {$set: {isDone: todo.isDone, doneDate: todo.doneDate}}, {}, function (err, count) {
        if(callback) {
            callback(err, todo);
        }
    });
}


module.exports = {all : publicAll, add : publicAdd, get : publicGet, edit:publicEdit, updateStatus : publicUpdateStatus };