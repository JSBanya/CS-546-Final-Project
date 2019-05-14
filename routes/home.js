const express = require("express");
const router = express.Router();
const candidates = require("../data/candidates");
const employers = require("../data/employers");
const jobs = require("../data/jobs");

router.get('/', async (req, res) => {
	if(req.session._id !== undefined) {
		if(req.session.type === "candidate") {
			// Candidate is logged in
			try {
				let profile = await candidates.getCandidateById(req.session._id);
				let joblist = await jobs.getAllJobs();

				for(let i = 0; i < joblist.length; i++) {
					let owner = await employers.getEmployerById(joblist[i].owner);
					joblist[i].employerImage = owner.profileImage;
					joblist[i].employer = owner.name;
				}

				res.render('homeCandidate', { 
					title: 'JobSrc', 
					css: ["homeCandidate"], 
					js: ["homeCandidate"],
					profile: profile,
					joblist: joblist
				});
				return;
			} catch(e) {
				res.status(500).send(e.toString()); 
				return;
			}
		} else {
			try {
				let profile = await employers.getEmployerById(req.session._id);
				let candidateList = await candidates.getAllCandidates();
				res.render('homeEmployer', {title: 'JobSrc', css: ["homeEmployer"], js: ["homeEmployer"], profile: profile, candidates: candidateList});
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