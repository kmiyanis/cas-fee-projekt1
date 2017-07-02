;(function (services) {


    function getAll(filter) {
        return fetch(`/todos/${filter}/`, {
            method: 'get'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (parsedData) {
            return parsedData;
        });
    }


    function addTodo(todo) {
        return fetch('/todos/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        });
    }


    function getOne(id) {
        return fetch(`/todos/todo/${id}/`, {
            method: 'get'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (parsedData) {
            return parsedData;
        });
    }


    function editTodo(id, todo) {
        return fetch(`/todos/edit/${id}/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (parsedData) {
            return parsedData;
        });
    }


    function updateStatus(id, todo) {
        return fetch(`/todos/done/${id}/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (parsedData) {
            return parsedData;
        });
    }


    services.restClient = {
        getAll,
        addTodo,
        getOne,
        editTodo,
        updateStatus
    };


}(window.services = window.services || {}));