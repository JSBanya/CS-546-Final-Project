const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
	if(req.session._id !== undefined) {
		if(req.session.type === "employer") {
			res.render('newjob', {title: 'Create new job', css: ["newjob"], js: ["newjob"]});
			return;
		} else {
			res.redirect("/home");
			return;
		}
	}

	res.redirect("/login");
	return;
});

router.post('/', async (req, res) => {
	if(req.session._id === undefined) {
		// Not logged in
		res.redirect("/login");
		return;
	}

	if(req.session.type !== "employer") {
		// Not an employer
		res.redirect("/home");
		return;
	}

		
	// Create new job
	// TODO

	// Return to home
	res.redirect("/home");
	return;
});

module.exports = router;