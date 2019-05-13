const express = require("express");
const router = express.Router();
const moment = require("moment");

router.get('/', async (req, res) => {
	res.render('create', {title: 'Create An Account', css: ["create"], js: ["create"]});
});

router.post('/candidate', async (req, res) => {
	let data = req.body;
	let isEmpty = (x) => {
		if(x === undefined || x === null || x === "") {
			return true;
		}
		return false;
	};

	/*****************
	* Validate request
	******************/

	// Check for emptiness of required fields
	if(isEmpty(data.candidateFirstName) 
		|| isEmpty(data.candidateLastName) 
		|| isEmpty(data.candidateEmail) 
		|| isEmpty(data.candidatePassword) 
		|| isEmpty(data.candidateConfirmPassword)) 
	{
		// A required field is empty
		res.status(400).send("400 - Bad Request (empty required field)");
		return;
	}

	// If more than one skills, check for all related fields being arrays
	if(!((Array.isArray(data.candidateSkill) && Array.isArray(data.candidateSkillYears)) 
		|| (!Array.isArray(data.candidateSkill) && !Array.isArray(data.candidateSkillYears)))) 
	{
		res.status(400).send("400 - Bad Request (bad skill check)");
		return;
	}

	// If skills is an array, check for equality of size of related fields
	if(Array.isArray(data.candidateSkill) && data.candidateSkill.length !== data.candidateSkillYears.length) {
		res.status(400).send("400 - Bad Request (inequal skill fields sizes)");
		return;
	}

	// If more than one experience, check all related fields being arrays
	if(!((Array.isArray(data.candidateExperience) 
		&& Array.isArray(data.experienceDescription) 
		&& Array.isArray(data.candidateExperienceFrom) 
		&& Array.isArray(data.candidateExperienceTo))
		||
		(!Array.isArray(data.candidateExperience) 
		&& !Array.isArray(data.experienceDescription) 
		&& !Array.isArray(data.candidateExperienceFrom) 
		&& !Array.isArray(data.candidateExperienceTo))))
	{
		res.status(400).send("400 - Bad Request (bad experience check)");
		return;
	}

	// If experience is an array, check for equality of size of related fields
	if(Array.isArray(data.candidateExperience) && !(data.candidateExperience.length === data.experienceDescription.length 
													&& data.experienceDescription.length === data.candidateExperienceFrom.length 
													&& data.candidateExperienceFrom.length === data.candidateExperienceTo.length))
	{
		res.status(400).send("400 - Bad Request (inequal experience field sizes");
		return;
	}

	// Check for valid numbers of skill years
	if(Array.isArray(data.candidateSkillYears)) {
		for(let i = 0; i < data.candidateSkillYears; i++) {
			if(Number(data.candidateSkillYears[i]) == NaN) {
				res.status(400).send("400 - Bad Request (bad skill years)");
				return;
			}
		}
	} else if(!isEmpty(data.candidateSkillYears)) {
		if(Number(data.candidateSkillYears) == NaN) {
			res.status(400).send("400 - Bad Request (bad skill years)");
			return;
		}
	}

	// Check for valid dates of experience
	if(Array.isArray(data.candidateExperienceFrom)) {
		for(let i = 0; i < data.candidateExperienceFrom.length; i++) {
			if(!moment(data.candidateExperienceFrom[i]).isValid() || !moment(data.candidateExperienceTo[i]).isValid()) {
				res.status(400).send("400 - Bad Request (invalid experience date)");
				return;
			} else if(data.candidateExperienceFrom[i] > data.candidateExperienceTo[i]) {
				res.status(400).send("400 - Bad Request (invalid experience date -- From > To)");
				return;
			}
		}
	}

	// Check for valid password match
	if(data.candidatePassword != data.candidateConfirmPassword) {
		res.status(400).send("400 - Bad Request (invalid password confirmation)");
		return;
	}

	// Good to go; Store
	console.log(data);

	res.redirect("/");
});

module.exports = router;