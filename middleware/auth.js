const candidates = require("../data/candidates");
const employers = require("../data/employers");

const auth = async (req, res, next) => {
	if(req.session._id !== undefined) {
		res.redirect("/home")
		return;
	}

	next();
}

module.exports = auth;