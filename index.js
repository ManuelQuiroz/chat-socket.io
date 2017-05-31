var fs = require('fs');
var https = require('https');
var express = require('express');
var app = express();

var options = {
    key: fs.readFileSync('./certificate/key.pem'),
    cert: fs.readFileSync('./certificate/cert.pem')
};
var serverPort = 8445;

var server = https.createServer(options, app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(serverPort, function() {
    console.log('server up and running at %s port', serverPort);
});

var bb = "qWEARTYUI";

io.on('connection', function(socket) {
    console.log('connection done');
    var plus = 0;
    setInterval(function() {
        plus++;
        socket.emit('message', plus);
    }, 1000);
    socket.on('message', function(msg) {
        io.emit('message', msg);
    });

    socket.on('disconnect', function(data) {
        console.log('disconnect done', data);
    });

    socket.broadcast.emit('chat message', bb);
});
