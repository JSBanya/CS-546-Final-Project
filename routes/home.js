const express = require("express");
const router = express.Router();
const candidates = require("../data/candidates");
const employers = require("../data/employers");

router.get('/', async (req, res) => {
	if(req.session._id !== undefined) {
		if(req.session.type === "candidate") {
			// Candidate is logged in
			try {
				let profile = await candidates.getCandidateById(req.session._id);
				res.render('home', {title: 'JobSrc', css: ["home"], js: ["home"], firstName: profile.firstName, lastName: profile.lastName});
				return;
			} catch(e) {
				res.status(500).send(e); 
				return;
			}
		} else {
			res.render('home', {title: 'JobSrc', css: ["home"], js: ["home"]});
			return;
		}
	}

	res.redirect("/login")
});


module.exports = router;