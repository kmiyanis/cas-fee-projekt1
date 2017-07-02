const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Path to static Files
app.use(express.static(__dirname + '/public'));

// Index
app.get("/", function(req, res){
    res.sendFile("/html/index.html",  {root: __dirname + '/public/'});
});

// Todos Router
app.use("/todos", require('./routes/todoRouter.js'));


// error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


const hostname = '127.0.0.1';
const port = 3824;
app.listen(port, hostname, () => {  console.log(`Server running at http://${hostname}:${port}/`); });