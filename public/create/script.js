if(!location.href.startsWith("https://obliv.cf") && !location.href.startsWith("https://www.obliv.cf")){
    location.href = "https://obliv.cf/create"
}

// Create Socket Variable:
var socket = new io();

function validURL(tester=""){
    var testURL = tester.trim();
    var pattern = new RegExp('((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    var yesRegexp = !!pattern.test(testURL);
    var yesHttp = testURL.startsWith("https://") || testURL.startsWith("http://");
    if(yesRegexp && yesHttp) return true;
    else if(testURL === "") return true;
    else return false;
}

document.querySelector("#create-url").addEventListener("click", () => {
    var longURLTmp = document.querySelector("#long-url-input").value.trim();
    var shortCodeTmp = document.querySelector("#short-url-input").value.trim();
    if(longURLTmp === ""){
        alert("Please type in a URL to shorten.");
        return;
    }
    if(validURL(longURLTmp) === false){
        alert("That URL doesn't look right!\nPlease check your input.");
        return;
    }
    socket.emit("createURL", {
        longURL: longURLTmp,
        shortCode: shortCodeTmp,
        randomShortCode: !(shortCodeTmp.length > 0)
    });
});

socket.on("returnNewURL", (dataArray)=>{
    alert(dataArray[0]);
    console.log(dataArray[1]);
});

if (location.protocol != 'https:') {
 location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
