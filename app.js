const express = require("express");
const config = require('config');
let http = require("http");
let app = express();

app.use('',express.static('dist'));
app.use('/list',express.static('dist'));
app.use('/upload',express.static('dist'));
app.get("/health", (req, res) => {
  res.send({
    status: "UP"
  });
});
app.get("/config", (req, res) => {
  res.send(config);
});

const port = process.env.PORT || "3608";
const server = http.createServer(app);

app.set("port", port);

server.listen(port);
