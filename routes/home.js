const express = require("express");
const router = express.Router();
const candidates = require("../data/candidates");
const employers = require("../data/employers");
const jobs = require("../data/jobs");

router.get('/', async (req, res) => {
	if(req.session._id === undefined) {
		res.redirect("/login");
		return;
	}

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
	}

	// Otherwise employer

	// Format search
	let search = {};
	if(req.query.skill !== undefined) search.skill = (Array.isArray(req.query.skill) ? req.query.skill : [req.query.skill]);
	if(req.query.years !== undefined) search.years = (Array.isArray(req.query.years) ? req.query.years : [req.query.years]);

	try {
		let profile = await employers.getEmployerById(req.session._id);
		let candidateList;

		if(search.skill !== undefined && search.years !== undefined)
			candidateList = await candidates.candidateSearch(search.skill, search.years);
		else 
			candidateList = await candidates.getAllCandidates();
		
		res.render('homeEmployer', {title: 'JobSrc', css: ["homeEmployer"], js: ["homeEmployer"], profile: profile, candidates: candidateList});
		return;
	} catch(e) {
		res.status(500).send(e.toString()); 
		return;
	}
});

module.exports = router;