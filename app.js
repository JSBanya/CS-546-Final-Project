const express = require("express");
const app = express();
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const fs = require("fs");
const https = require("https");
const http = require("http");
const bodyParser = require("body-parser");
const session = require('express-session');
const middleware = require('./middleware');
const MongoDBStore = require('connect-mongodb-session')(session);

// Set up session storage
var store = new MongoDBStore({
  uri: "mongodb://localhost:27017/",
  databaseName: "JobSrc",
  collection: 'sessions'
});

store.on('error', function(error) {
  console.log(error);
});

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public", express.static("./public"));
app.use(session({
	name: 'AuthCookie',
	secret: '96be76e6abc3414d3876e427e8209f08e1314af983a2540571712d625ab9a93b',
	resave: false,
	saveUninitialized: true,
	store: store
}));

// Our defined middleware
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