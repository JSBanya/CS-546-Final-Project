const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
	if(req.session._id === undefined) {
		// Not logged in
		res.redirect("/login");
		return;
	}

	if(req.session.type === "employer") {
		// Employer
		res.render('employerEdit', {title: 'EmployerEdit', css: ["employerEdit"], js: ["employerEdit"]});
		return;
	}

	// Otherwise, candidate
	res.render('candidateEdit', {title: 'CandidateEdit', css: ["candidateEdit"], js: ["candidateEdit"]});
	return;
});

module.exports = router;