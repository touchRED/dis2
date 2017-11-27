var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var sockets = [];

io.on('connection', function(socket){
  sockets.push(socket);
  console.log('user ' + socket.id + ' connected');
  // socket.broadcast.emit('hi');
  socket.emit('initialize', socket.id);

  socket.on('light', function(msg){
    var i = sockets[Math.floor(Math.random() * sockets.length)];
    while(i.id == msg){
      i = sockets[Math.floor(Math.random() * sockets.length)];
    }
    io.emit('light', i.id);
  });

  socket.on('disconnect', function(){
    for(var i = 0; i < sockets.length; i++){
      if(sockets[i].id == socket.id){
        sockets.splice(i, 1);
        console.log('user ' + socket.id + ' disconnected');
        console.log(sockets.length + " users remaining");
        break;
      }
    }
  });
});

http.listen(PORT, function(){
  console.log('listening on', PORT);
});
