const express = require("express");
const router = express.Router();
const candidates = require("../data/candidates");
const employers = require("../data/employers");

router.get('/', async (req, res) => {
	try {
		let c = await candidates.getCandidateBySession(req.sessionID);

		// Candidate is logged in
		res.render('home', {title: 'JobSrc', css: ["home"], js: ["home"], firstName: c.firstName, lastName: c.lastName});
		return;
	} catch(e) { 
		
	}


	res.redirect("/login")
});


module.exports = router;