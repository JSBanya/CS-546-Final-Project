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

		
	// Create new job
	let job = req.body;
	let isEmpty = (x) => {
		if(x === undefined || x === null || x === "") {
			return true;
		}
		return false;
	};


	// Check for emptiness of required fields
	if(isEmpty(job.jobName) || isEmpty(job.jobDescription)) {
		res.status(400).send("400 - Bad Request (empty required field)");
		return;
	}

	// Size of fields is greater than permitted
	if(job.jobName.length > 50
		|| job.jobDescription.length > 1000
		|| (!Array.isArray(job.jobSkill) && !isEmpty(job.jobSkill) && job.jobSkill.length > 30))
	{
		res.status(400).send("400 - Bad Request (bad size check)");
		return;
	}

	// If more than one skills, check for all related fields being arrays
	if(!((Array.isArray(job.jobSkill) && Array.isArray(job.jobSkillYears)) 
		|| (!Array.isArray(job.jobSkill) && !Array.isArray(job.jobSkillYears))))
	{
		res.status(400).send("400 - Bad Request (bad skill check)");
		return;
	}

	// If skills is an array, check for equality of size of related fields
	if(Array.isArray(job.jobSkill) && job.jobSkill.length !== job.jobSkillYears.length) {
		res.status(400).send("400 - Bad Request (inequal skill fields sizes)");
		return;
	}

	// Check for array size restrictions
	if (Array.isArray(job.jobSkill)) {
		for(let i = 0; i < job.jobSkill.length; i++) {
			if(job.jobSkill[i].length > 30) {
				res.status(400).send("400 - Bad Request (bad skill array size check)");
				return;
			}
		}
	}

	// Check for valid numbers of skill years
	if(Array.isArray(job.jobSkill)) {
		for(let i = 0; i < job.jobSkillYears.length; i++) {
			if(Number(job.jobSkillYears[i]) == NaN || job.jobSkillYears[i] < 0.1 || job.jobSkillYears[i] > 100) {
				res.status(400).send("400 - Bad Request (bad skill years)");
				return;
			}
		}
	} else if(!isEmpty(job.jobSkillYears)) {
		if(Number(job.jobSkillYears) == NaN || job.jobSkillYears < 0.1 || job.jobSkillYears > 100) {
			res.status(400).send("400 - Bad Request (bad skill years)");
			return;
		}
	}

	// Good to go; Format
	let newjob = {};
	newjob.name = job.jobName;
	newjob.description = job.jobDescription;
	newjob.open = true;
	
	newjob.skills = [];
	if(Array.isArray(job.jobSkill)) {
		for(let i = 0; i < job.jobSkill.length; i++) {
			newjob.skills.push({skill: job.jobSkill[i], years: job.jobSkillYears[i]})
		}
	} else if(!isEmpty(job.jobSkillYears)) {
		newjob.skills.push({skill: job.jobSkill, years: job.jobSkillYears})
	}

	try {
		await jobs.addJob(req.session._id, newjob);	
	} catch(e) {
		res.status(500).send(`500 - Internal Server Error (Unable to store job)`);
		console.log(e.toString());
		return;
	}
	
	console.log("New Job by " + req.session._id)
	console.log(newjob);

	// Return to home
	res.redirect("/home");
	return;
});

module.exports = router;