const express = require("express");
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

const port = process.env.PORT || "3608";
const server = http.createServer(app);

app.set("port", port);

server.listen(port);
