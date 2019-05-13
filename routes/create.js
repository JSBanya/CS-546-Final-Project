const express = require("express");
const router = express.Router();
const moment = require("moment");
const candidates = require("../data/candidates");
const employers = require("../data/employers");
const bcrypt = require('bcrypt');

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

	// Size of fields is greater or less than permitted
	if(data.candidateFirstName.length > 30
		|| data.candidateLastName.length > 30
		|| data.candidateEmail.length > 30
		|| (!isEmpty(data.candidateBiography) && data.candidateBiography.length > 500)
		|| data.candidatePassword.length > 30
		|| data.candidateConfirmPassword.length > 30
		|| data.candidatePassword.length < 8
		|| data.candidateConfirmPassword.length < 8
		|| (!Array.isArray(data.candidateSkill) && !isEmpty(data.candidateSkill) && data.candidateSkill.length > 30)
		|| (!Array.isArray(data.candidateExperience) && !isEmpty(data.candidateExperience) && data.candidateExperience.length > 50)
		|| (!Array.isArray(data.experienceDescription) && !isEmpty(data.experienceDescription) && data.experienceDescription.length > 1000))
	{
		res.status(400).send("400 - Bad Request (bad size check)");
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

	// Check for array size restrictions
	if (Array.isArray(data.candidateSkill)) {
		for(let i = 0; i < data.candidateSkill.length; i++) {
			if(data.candidateSkill[i].length > 30) {
				res.status(400).send("400 - Bad Request (bad skill array size check)");
				return;
			}
		}
	}

	if (Array.isArray(data.candidateExperience)) {
		for(let i = 0; i < data.candidateExperience.length; i++) {
			if(data.candidateExperience[i].length > 50 || data.experienceDescription[i].length > 1000) {
				res.status(400).send("400 - Bad Request (bad experience array size check)");
				return;
			}
		}
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

	// Good to go; Format
	let newCandidate = {};
	newCandidate.firstName = data.candidateFirstName;
	newCandidate.lastName = data.candidateLastName;
	newCandidate.email = data.candidateEmail;
	newCandidate.password = bcrypt.hashSync(data.candidatePassword, 16);
	newCandidate.biography = data.candidateBiography;
	
	newCandidate.skills = [];
	if(Array.isArray(data.candidateSkill)) {
		for(let i = 0; i < data.candidateSkill.length; i++) 
			newCandidate.skills.push({skill: data.candidateSkill[i], years: data.candidateSkillYears[i]});
	} else {
		newCandidate.skills.push({skill: data.candidateSkill, years: data.candidateSkillYears});
	}

	newCandidate.experience = [];
	if(Array.isArray(data.candidateExperience)) {
		for(let i = 0; i < data.candidateExperience.length; i++) 
			newCandidate.experience.push({experience: data.candidateExperience[i], description: data.experienceDescription[i], from: data.candidateExperienceFrom[i], to: data.candidateExperienceTo[i]});
	} else {
		newCandidate.experience.push({experience: data.candidateExperience, description: data.experienceDescription, from: data.candidateExperienceFrom, to: data.candidateExperienceTo});
	}

	console.log("New candidate:")
	console.log(newCandidate);

	try {
		await candidates.addCandidate(newCandidate);
	} catch(e) {
		res.status(500).send(`500 - Internal Server Error (Unable to store candidate)`);
		console.log(e);
		return;
	}

	res.status(200).redirect("/");
});

router.post('/employer', async (req, res) => {
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
	if(isEmpty(data.employerName) 
		|| isEmpty(data.employerEmail) 
		|| isEmpty(data.employerPassword) 
		|| isEmpty(data.employerConfirmPassword)) 
	{
		// A required field is empty
		res.status(400).send("400 - Bad Request (empty required field)");
		return;
	}

	// Check lengths
	if(data.employerName.length > 50
		|| data.employerEmail.length > 30
		|| data.employerPassword.length > 30
		|| data.employerConfirmPassword.length > 30
		|| data.employerPassword.length < 8
		|| data.employerConfirmPassword.length < 8
		|| (!isEmpty(data.employerDescription) && !isEmpty(data.employerDescription) && data.employerDescription > 500))
	{
		res.status(400).send("400 - Bad Request (bad size check)");
		return;
	}

	// Check for valid password match
	if(data.employerPassword != data.employerConfirmPassword) {
		res.status(400).send("400 - Bad Request (invalid password confirmation)");
		return;
	}

	// Good to go; Store
	let newEmployer = {};
	newEmployer.name = data.employerName;
	newEmployer.email = data.employerEmail;
	newEmployer.password = bcrypt.hashSync(data.employerPassword, 16);
	newEmployer.description = data.employerDescription;

	console.log("New employer:")
	console.log(newEmployer);

	try {
		await employers.addEmployer(newEmployer);
	} catch(e) {
		res.status(500).send(`500 - Internal Server Error (Unable to store employer)`);
		console.log(e);
		return;
	}

	res.redirect("/");
});

module.exports = router;