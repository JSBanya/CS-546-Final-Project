const loginRoutes = require("./login");
const createRoutes = require("./create");
const homeRoutes = require("./home");
const logoutRoutes = require("./logout")
const newjobRoutes = require("./newjob")
const candidates = require("../data/candidates");
const accountRoutes = require("./account");

const constructorMethod = app => {
	app.use("/login", loginRoutes);
	app.use("/create", createRoutes);
	app.use("/home", homeRoutes);
	app.use("/logout", logoutRoutes);
	app.use("/newjob", newjobRoutes);
	app.use("/account", accountRoutes);

	app.get("/", async (req, res) => {
		res.render('index', {title: 'JobSrc', css: ["index"], js: ["index"]});
	});

	app.use("*", (req, res) => {
		res.status(404).send("404 - Not Found");
	});
};

module.exports = constructorMethod;