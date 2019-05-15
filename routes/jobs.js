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
	let isEmpty = (x) => {
		if(x === undefined || x === null || x === "") {
			return true;
		}
		return false;
	};

	if(!data.jobID) {
		res.status(400).send("400 - Bad Request (no job id)");
		return;
	}

	// Test for ownership
	let ownerID;
	try {
		let j = await jobs.getJobById(data.jobID);
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

	if(isEmpty(data.jobName) || isEmpty(data.jobDescription) || isEmpty(data.jobRate) || isEmpty(data.jobType)) {
		res.status(400).send("400 - Bad Request (empty required field)");
		return;
	}

	// Size of fields is greater than permitted
	if(data.jobName.length > 50
		|| data.jobDescription.length > 1000
		|| data.jobRate > 50
		|| data.jobType > 50
		|| (!Array.isArray(data.jobSkillName) && !isEmpty(data.jobSkillName) && data.jobSkillName.length > 30))
	{
		res.status(400).send("400 - Bad Request (bad size check)");
		return;
	}

	// If more than one skills, check for all related fields being arrays
	if(!((Array.isArray(data.jobSkillName) && Array.isArray(data.jobSkillYears)) 
		|| (!Array.isArray(data.jobSkillName) && !Array.isArray(data.jobSkillYears))))
	{
		res.status(400).send("400 - Bad Request (bad skill check)");
		return;
	}

	// If skills is an array, check for equality of size of related fields
	if(Array.isArray(data.jobSkillName) && data.jobSkillName.length !== data.jobSkillYears.length) {
		res.status(400).send("400 - Bad Request (inequal skill fields sizes)");
		return;
	}

	// Check for array size restrictions
	if (Array.isArray(data.jobSkillName)) {
		for(let i = 0; i < data.jobSkillName.length; i++) {
			if(data.jobSkillName[i].length > 30) {
				res.status(400).send("400 - Bad Request (bad skill array size check)");
				return;
			}
		}
	}

	// Check for valid numbers of skill years
	if(Array.isArray(data.jobSkillName)) {
		for(let i = 0; i < data.jobSkillYears.length; i++) {
			if(Number(data.jobSkillYears[i]) == NaN || data.jobSkillYears[i] < 0.1 || data.jobSkillYears[i] > 100) {
				res.status(400).send("400 - Bad Request (bad skill years)");
				return;
			}
		}
	} else if(!isEmpty(data.jobSkillYears)) {
		if(Number(data.jobSkillYears) == NaN || data.jobSkillYears < 0.1 || data.jobSkillYears > 100) {
			res.status(400).send("400 - Bad Request (bad skill years)");
			return;
		}
	}

	if(isEmpty(data.jobRate) || data.jobRate.length > 50) {
		res.status(400).send("400 - Bad Request (bad job rate)");
		return;
	}

	if(data.jobType != "part-time" && data.jobType != "full-time") {
		res.status(400).send("400 - Bad Request (bad job type)");
		return;
	}

	// Good to go; update
	try {
		await jobs.updateJobTitle(data.jobID, data.jobName);
	} catch (e) {
		res.status(500).send(e.toString());
		return;
	}

	try {
		await jobs.updateJobDesc(data.jobID, data.jobDescription);
	} catch (e) {
		res.status(500).send(e.toString());
		return;
	}

	try {
		await jobs.updateJobRate(data.jobID, data.jobRate);
	} catch (e) {
		res.status(500).send(e.toString());
		return;
	}

	try {
		await jobs.updateJobType(data.jobID, data.jobType);
	} catch (e) {
		res.status(500).send(e.toString());
		return;
	}
	
	let skills = [];
	if(Array.isArray(data.jobSkillName)) {
		for(let i = 0; i < data.jobSkillName.length; i++) {
			skills.push({skill: data.jobSkillName[i], years: data.jobSkillYears[i]})
		}
	} else if(!isEmpty(data.jobSkillYears)) {
		skills.push({skill: data.jobSkillName, years: data.jobSkillYears})
	}

	try {
		await jobs.updateJobSkills(data.jobID, skills);
	} catch (e) {
		res.status(500).send(e.toString());
		return;
	}

	res.redirect("/jobs/"+data.jobID.toString());
	return;
});

module.exports = router;