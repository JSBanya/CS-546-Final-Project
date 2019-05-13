const loginRoutes = require("./login");
const createRoutes = require("./create");
const homeRoutes = require("./home");
const logoutRoutes = require("./logout")
const newjobRoutes = require("./newjob")
const candidates = require("../data/candidates");
const candidateEditRoutes = require("./candidateEdit");
const employerEditRoutes = require("./employerEdit");

const constructorMethod = app => {
	app.use("/login", loginRoutes);
	app.use("/create", createRoutes);
	app.use("/home", homeRoutes);
	app.use("/logout", logoutRoutes);
	app.use("/newjob", newjobRoutes);
	app.use("/candidateEdit", candidateEditRoutes);
	app.use("/employerEdit",employerEditRoutes);

	app.get("/", async (req, res) => {
		res.render('index', {title: 'JobSrc', css: ["index"], js: ["index"]});
	});

	app.use("*", (req, res) => {
		res.status(404).send("404 - Not Found");
	});
};

module.exports = constructorMethod;