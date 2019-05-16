const express = require("express");
const router = express.Router();
const jobs = require("../data/jobs");

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

	let data = req.body;
	
	let newjob = {};
	newjob.name = data.jobName;
	newjob.description = data.jobDescription;
	newjob.payRate = data.jobRate;
	newjob.type = data.jobType;
	
	newjob.skills = [];
	if(Array.isArray(data.jobSkill) && Array.isArray(data.jobSkillYears)) {
		for(let i = 0; i < data.jobSkill.length; i++) 
			newjob.skills.push({skill: data.jobSkill[i], years: data.jobSkillYears[i]});
	} else if(data.jobSkill && data.jobSkillYears) {
		newjob.skills.push({skill: data.jobSkill, years: data.jobSkillYears});
	}

	try {
		await jobs.addJob(req.session._id, newjob);	
	} catch(e) {
		res.status(400).send(`400 - Bad job: ${e.toString()}`);
		return;
	}
	
	console.log("New Job by " + req.session._id)
	console.log(newjob);

	// Return to home
	res.redirect("/home");
	return;
});

module.exports = router;