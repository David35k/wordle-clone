const http = require('http')
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

var server = http.createServer(function(req, res) {
    console.log("request was made: " + req.url);
    res.writeHead(200, {"Content-Type": "text/html"});

    var myReadStream = fs.createReadStream(__dirname + "/index.html", "utf8");
    myReadStream.pipe(res);
});

server.listen(port, hostname);
console.log("sup dawgie listen to port " + port);

