const express = require("express");
const app = express();
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const fs = require("fs");
const https = require("https");
const http = require("http");
const bodyParser = require("body-parser");
const session = require('express-session');
const uuid = require("uuid");
const middleware = require('./middleware');


app.use("/public", express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	genid: (req) => {
    	return uuid() // use UUIDs for the session IDs
  	},
	name: 'AuthCookie',
	secret: '96be76e6abc3414d3876e427e8209f08e1314af983a2540571712d625ab9a93b',
	resave: false,
	saveUninitialized: true
}));

app.use(middleware.log);
app.get("/", middleware.auth);
app.get("/login", middleware.auth);

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
    res.writeHead(301, { "Location": "https://" + req.headers.host + req.url });
    res.end();
}).listen(80);