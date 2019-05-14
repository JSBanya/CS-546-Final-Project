const express = require("express");
const router = express.Router();
const candidates = require("../data/candidates");
const employers = require("../data/employers");
const jobs = require("../data/jobs");

router.get('/:id', async (req, res) => {
	if(req.session._id === undefined) {
		// Not logged in
		res.redirect("/login");
		return;
	}

	let id = req.params.id;
	let jobProfile;
	try {
		jobProfile = await jobs.getJobById(id);
	} catch(e) {
		res.status(404).send("404 - Job not found");
		return;
	}

	let profile;
	if(req.session.type === "employer") {
		try {
			profile = await employers.getEmployerById(req.session._id);
		} catch(e) {
			res.status(500).send(e.toString());
			return;
		}
	} else {
		try {
			profile = await candidates.getCandidateById(req.session._id);
		} catch(e) {
			res.status(500).send(e.toString());
			return;
		}
	}

	let ownerProfile;
	try {
		let owner = await jobs.getJobById(id);
		ownerProfile = await employers.getEmployerById(owner.owner);
	} catch(e) {
		res.status(500).send(e.toString());
		return;
	}

	res.render('job', { 
		title: 'Create new job', 
		css: ["job"], 
		js: ["job"], 
		job: jobProfile, 
		profile: profile, 
		ownerProfile: ownerProfile,
		isOwner: (ownerProfile._id.toString() == req.session._id.toString()),
		layout: "home"
	});
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

	// Return to home
	res.redirect("/home");
	return;
});

module.exports = router;