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

	let myProfile;
	try {
		if(req.session.type == "employer") {
			myProfile = await employers.getEmployerById(req.session._id);
		} else {
			myProfile = await candidates.getCandidateById(req.session._id);
		}
	} catch(e) {
		res.status(500).send(e.toString())
		return;
	}

	let ownerProfile;
	try {
		let owner = await jobs.getJobById(id);
		ownerProfile = await employers.getEmployerById(owner.owner);
	} catch(e) {
		res.status(500).send(e.toString());
		return;
	}

	let candidatesApplied = [];
	for(let i = 0; i < jobProfile.applications.length; i++) {
		try {
			let c = await candidates.getCandidateById(jobProfile.applications[i].toString());
			candidatesApplied.push(c);
		} catch(e) {
			res.status(500).send(e.toString());
			return;
		}
	}

	res.render('job', { 
		title: 'Create new job', 
		css: ["job"], 
		js: ["job"], 
		job: jobProfile, 
		myProfile: myProfile, 
		ownerProfile: ownerProfile,
		candidatesApplied: candidatesApplied,
		alreadyApplied: jobProfile.applications.includes(myProfile._id.toString()),
		isFullTime: (jobProfile.type == "full-time"),
		isOwner: (ownerProfile._id.toString() == req.session._id.toString()),
		layout: "home"
	});
	return;
});

router.get('/apply/:id', async (req, res) => {
	if(req.session._id === undefined) {
		// Not logged in
		res.redirect("/login");
		return;
	}

	if(req.session.type !== "candidate") {
		// Not a candidate
		res.redirect("/home");
		return;
	}

	try {
		await jobs.addApplication(req.params.id, req.session._id);
	} catch(e) {
		res.status(500).send(e.toString());
		return;
	}

	res.redirect("/jobs/"+req.params.id);
	return;
});

router.get('/close/:id', async (req, res) => {
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

	let ownerID;
	try {
		let j = await jobs.getJobById(req.params.id);
		ownerID = j.owner;
	} catch(e) {
		res.status(500).send(e.toString());
		return;
	}

	if(ownerID.toString() != req.session._id) {
		// Does not own the job
		res.status(403).send("403 - Forbidden");
		return;
	}


	try {
		await jobs.closeJob(req.params.id);
	} catch(e) {
		res.status(500).send(e.toString());
		return;
	}

	res.redirect("/jobs/"+req.params.id);
	return;
});

router.post('/edit', async (req, res) => {
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

	let data = req.body;
	let skills = [];
	if(Array.isArray(data.jobSkillName) && Array.isArray(data.jobSkillYears)) {
		for(let i = 0; i < data.jobSkillName.length; i++) 
			skills.push({skill: data.jobSkillName[i], years: data.jobSkillYears[i]});
	} else if(data.jobSkillName && data.jobSkillYears) {
		skills.push({skill: data.jobSkillName, years: data.jobSkillYears});
	}

	try {
		await jobs.updateJobTitle(data.jobID, data.jobName);
		await jobs.updateJobDesc(data.jobID, data.jobDescription);
		await jobs.updateJobRate(data.jobID, data.jobRate);
		await jobs.updateJobType(data.jobID, data.jobType);
		await jobs.updateJobSkills(data.jobID, skills);
	} catch (e) {
		res.status(500).send(e.toString());
		return;
	}

	res.redirect("/jobs/"+data.jobID.toString());
	return;
});

module.exports = router;