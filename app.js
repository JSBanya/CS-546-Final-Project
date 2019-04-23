const express = require("express");
const app = express();
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const fs = require("fs");
const https = require("https");
const http = require("http");

app.use("/public", express.static("./public"));
app.use(express.json());

// Configure handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main", layoutsDir: __dirname + '/views/layouts/' }));
app.set("view engine", "handlebars");

// Configure routes
configRoutes(app);

// Start server
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(443, () => {
  console.log("Server started");
});

// Redirect HTTP to HTTPs
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers.host + req.url }).send();
}).listen(80);