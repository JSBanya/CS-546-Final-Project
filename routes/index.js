const loginRoutes = require("./login");

const constructorMethod = app => {
	app.use("/login", loginRoutes);

	app.get("/", (req, res) => {
		res.render('index', {title: 'Bits4Hire', css: ["index"], js: ["index"]});
	});

	app.use("*", (req, res) => {
		res.status(404).send("Not Found");
	});
};

module.exports = constructorMethod;