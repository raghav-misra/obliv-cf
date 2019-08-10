// Redirect ID
var id = decodeURI(location.search.replace("?", "")).trim();

// Initialize Socket.IO
var socket = io();

if(id == "") location.href = "/create"

socket.emit("queryURL", id);

socket.on("returnURL", (linkData)=>{
    if(linkData.linkExists) location.href = linkData.longURL;
    else location.href = "/create";
});

