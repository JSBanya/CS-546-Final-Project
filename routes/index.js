const constructorMethod = app => {
	app.get("/", (req, res) => {
		res.render('index', {title: 'Not implemented!'})
	});

	app.use("*", (req, res) => {
		res.status(404).send("Not Found");
	});
};

module.exports = constructorMethod;