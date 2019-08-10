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
    io.emit("returnNewURL", createNewURL(metadata));
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});

function createNewURL(metadata){
  var linksJSON = JSON.parse(fs.readFileSync('urls.json'));
  if(linksJSON.hasOwnProperty("data_" + metadata.shortCode))
    return ["That ending already exists!", "ERROR"];
  if(metadata.randomShortCode){
    var newId = "";
    while(!linksJSON.hasOwnProperty("data_" + newId)){
      newId = randomString(randomIntFromInterval(5,8));
    }
    return urlGen(newId, metadata.longURL, linksJSON);
  }
  else return urlGen(metadata.shortCode, metadata.longURL, linksJSON);
}

function urlGen(id, longURL, linksJSON){
  linksJSON["data_" + id.trim()] = longURL;
  fs.writeFileSync("urls.json", JSON.stringify(linksJSON));
  return ["Success! Your shortened link is: " + "https://obliv.cf?" + id.trim(), id.trim()];
}

function getURL(id){
  var linksJSON = JSON.parse(fs.readFileSync('urls.json'));
  var longURL = "/create";
  if(linksJSON.hasOwnProperty("data_" + id.trim())) longURL = linksJSON["data_" + id.trim()];
  console.log(JSON.stringify(linksJSON));
  return longURL;
}

function randomString(length) {
  var mask = 'abcdefghijklmnopqrstuvwxyz';
  mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  mask += '0123456789';
  var result = '';
  for (var i = length; i > 0; --i){
    result += mask[Math.floor(Math.random() * mask.length)];
  }
  return result;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}