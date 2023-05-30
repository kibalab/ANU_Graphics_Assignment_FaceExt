const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const app = express();

const HTTP_PORT = 8080;
const HTTPS_PORT = 8443;


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Create an HTTP server.
http.createServer(app).listen(HTTP_PORT);

if (fs.existsSync('./rootca.key') && fs.existsSync('./rootca.crt')) {
    const options = {
        key: fs.readFileSync('./rootca.key'),
        cert: fs.readFileSync('./rootca.crt')
    };
    // Create an HTTPS server.
    https.createServer(options, app).listen(HTTPS_PORT);
}