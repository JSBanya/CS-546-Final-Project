const loginRoutes = require("./login");
const createRoutes = require("./create");

const constructorMethod = app => {
	app.use("/login", loginRoutes);
	app.use("/create", createRoutes);

	app.get("/", (req, res) => {
		res.render('index', {title: 'JobSrc', css: ["index"], js: ["index"]});
	});

	app.use("*", (req, res) => {
		res.status(404).send("404 - Not Found");
	});
};

module.exports = constructorMethod;