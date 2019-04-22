const express = require("express");
const app = express();
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", express.static("./public"));
app.use(express.json());

// Configure handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main", layoutsDir: __dirname + '/views/layouts/' }));
app.set("view engine", "handlebars");

// Configure routes
configRoutes(app);

// Start server
app.listen(3000, () => {
  console.log("Server started");
});