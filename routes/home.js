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
				res.render('homeCandidate', { 
					title: 'JobSrc', 
					css: ["homeCandidate"], 
					js: ["homeCandidate"], 
					firstName: profile.firstName, 
					lastName: profile.lastName,
					jobs: []
				});
				return;
			} catch(e) {
				res.status(500).send(e); 
				return;
			}
		} else {
			try {
				let profile = await employers.getEmployerById(req.session._id);
				let candidateList = await candidates.getAllCandidates();
				res.render('homeEmployer', {title: 'JobSrc', css: ["homeEmployer"], js: ["homeEmployer"], companyName: profile.name, candidates: candidateList});
				return;
			} catch(e) {
				res.status(500).send(e.toString()); 
				return;
			}
		}
	}

	res.redirect("/login")
});


module.exports = router;