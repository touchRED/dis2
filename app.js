var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 3000;

app.get('/', function(req, res){
  if(sockets.length > 0){
    res.sendFile(__dirname + '/index.html');
  }else{
    res.sendFile(__dirname + '/controller.html');
  }
});

var sockets = [];

io.on('connection', function(socket){
  sockets.push(socket);
  if(sockets.length > 1){
    sockets[0].emit('new display', socket.id);
  }
  console.log('user ' + socket.id + ' connected');
  // socket.broadcast.emit('hi');

  socket.on('light', function(msg){
    // var i = sockets[Math.floor(Math.random() * (sockets.length - 1)) + 1];
    // while(i.id == msg && sockets.length > 2){
    //   i = sockets[Math.floor(Math.random() * (sockets.length - 1)) + 1];
    // }
    io.emit('light', msg);
  });

  socket.on('random', function(msg){
    var i = sockets[Math.floor(Math.random() * (sockets.length - 1)) + 1];
    while(i.id == msg && sockets.length > 2){
      i = sockets[Math.floor(Math.random() * (sockets.length - 1)) + 1];
    }
    io.emit('random', i.id);
  });

  socket.on('hold', function(msg){
    io.emit('hold', msg);
  });

  socket.on('off', function(msg){
    io.emit('off', msg);
  });

  socket.on('disconnect', function(){
    for(var i = 0; i < sockets.length; i++){
      if(sockets[i].id == socket.id){
        sockets.splice(i, 1);
        if(sockets.length > 0){
          sockets[0].emit('lost display', socket.id);
        }
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
