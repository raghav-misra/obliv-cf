var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require("fs");

app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/');
});

io.on('connection', function(socket){
  socket.on("queryURL", (id)=>{
    var tmp = getURL(id);
    io.emit("returnURL", tmp);
  });
  socket.on("createURL", (metadata)=>{
    
  });
});

http.listen(666, function(){
  console.log('listening on *:666');
});

function getURL(id){
  var linksJSON = JSON.parse(fs.readFileSync('urls.json'));
  var tmp = { 
    linkExists: linksJSON.hasOwnProperty(id),
    longURL: "" 
  }
  if(linksJSON.hasOwnProperty(id)) tmp.longURL = linksJSON[id];
  return tmp;
}