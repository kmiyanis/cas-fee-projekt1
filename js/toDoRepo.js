let toDoRepo = (function () {
    "use strict";

    const storageName = 'toDoer';
    let toDoList = getStorage() === null ? [] : getStorage();

    class toDo {
        constructor(todo) {
            this.id = toDoList.length + 1;
            this.isDone = false;
            this.doneDate = false;
            this.title = todo.title;
            this.descroption = todo.descroption;
            this.created = moment();
            this.importance = todo.importance;
            this.deadline = todo.deadline;
        }
    }

    function addToDo(todo) {
        let _toDo = new toDo(todo);
        toDoList.push(_toDo);
        setStorage ();
    }

    function updateToDo(todo) {
        let toDoListIndex = getIndex(todo.id);
        toDoList[toDoListIndex] = todo;
        setStorage ();
    }

    function deleteTodo(todoId) {
        let toDoListIndex = getIndex(todoId);
        toDoList.splice(toDoListIndex,1);
        setStorage ();
    }

    function updateStatue(todoId, status) {
        let toDoListIndex = getIndex(todoId);

        toDoList[toDoListIndex].isDone = status;
        if(status === false) {
            toDoList[toDoListIndex].doneDate = false;
        } else {
            toDoList[toDoListIndex].doneDate = moment();
        }
        setStorage ();
    }

    function getIndex(todoId) {
        //let toDoListIndex = toDoList.findIndex(x => x.id === parseInt(todoId));
       let toDoListIndex = toDoList.map(x => x.id).indexOf(parseInt(todoId));
        return toDoListIndex;
    }

    function getAll() {
        let todos = getStorage ();
        let sortCat = localStorage.getItem('toDoer_filter');

        if(!todos || todos.length == 0) {
            return;
        }

        if(sortCat!== null && sortCat.length > 0) {

            todos.sort((a, b) => {

                return a[sortCat] - b[sortCat];
            });
            todos.reverse();
        }
        console.log(todos);
        return todos;
    }

    function setStorage (todo = toDoList) {
        if (typeof (Storage) == "undefined") { return false; }
        return localStorage.setItem(storageName, JSON.stringify(toDoList));
    }

    function getStorage () {
        if (typeof (Storage) == "undefined") { return false; }
        return JSON.parse(localStorage.getItem(storageName));
    }

    function getOneTodo (todoId) {
        let storageObj = getStorage();

        //storageObj.find(function(x) { console.log('x.id = '+ x.id ); console.log('typeof x.id = '+ typeof x.id); console.log(x.id === parseInt(todoId)); });
        return storageObj.find(x => x.id === parseInt(todoId, 10));
    }

    return {
        addToDo : addToDo,
        updateToDo : updateToDo,
        updateStatue : updateStatue,
        deleteTodo : deleteTodo,
        getAll : getAll,
        getOneTodo : getOneTodo
    };
})();
